import { List, Task } from 'generated/types'
import { resolvers } from '../resolvers/index'
import { Context } from '../../../libs/context'
const { fn, spyOn } = jest

describe('Test List service mutation', () => {
  describe('Test createList', () => {
    const createResult: List = {
      id: 'fakeId',
      listName: 'fakeListName',
    }
    const context: Context = {
      prisma: {
        list: {
          //@ts-ignore
          create: fn(() => Promise.resolve(createResult)),
        },
      },
    }
    const _parent = {}
    const input = {
      listName: 'fakeListName',
      tasks: {
        title: 'fakeTitle',
        status: 'fakeStatus',
      },
    }

    const createList = resolvers.Mutation?.createList

    it('can create list', async () => {
      //@ts-ignore
      await expect(createList(_parent, { input }, context)).resolves.toEqual(
        createResult
      )
      expect(context.prisma.list.create).toBeCalledTimes(1)
      expect(context.prisma.list.create).toBeCalledWith({
        data: {
          listName: input.listName,
          tasks: {
            create: input.tasks,
          },
        },
        include: { tasks: true },
      })
    })
  })

  describe('Test updateTask', () => {
    const updateTask = resolvers.Mutation?.updateTask
    const taskId = 1
    const input = {
      title: 'updatedFakeTitle',
      status: 'updatedStatus',
    }
    const updatedTask = {
      id: taskId,
      ...input,
      list: {
        id: 'fakeListId',
        listName: 'fakeListName',
      },
    }
    const context: Context = {
      prisma: {
        task: {
          //@ts-ignore
          update: fn(() => Promise.resolve(updatedTask)),
        },
      },
    }
    const _parent = {}
    it('Can update task', async () => {
      await expect(
        //@ts-ignore
        updateTask(_parent, { taskId, input }, context)
      ).resolves.toEqual(updatedTask)
      expect(context.prisma.task.update).toBeCalledTimes(1)
      expect(context.prisma.task.update).toBeCalledWith({
        where: { id: taskId },
        data: { ...input },
        include: { list: true },
      })
    })
  })

  describe('Test createTask', () => {
    const createResult = {
      id: 1,
      status: 'to-do',
      title: 'fakeTitle',
      list: {
        listName: 'fakeListName',
      },
      position: 0,
    }
    const context: Context = {
      prisma: {
        task: {
          //@ts-ignore
          create: fn(() => Promise.resolve(createResult)),
          //@ts-ignore
          count: fn(() => Promise.resolve(0)),
        },
      },
    }
    const _parent = {}
    const input = {
      title: 'fakeTitle',
      status: 'to-do',
      listId: 'fakeListId',
    }

    const createCallWith = {
      ...input,
      position: 0,
    }

    const createTask = resolvers.Mutation?.createTask

    it('can create task', async () => {
      //@ts-ignore
      await expect(createTask(_parent, { input }, context)).resolves.toEqual(
        createResult
      )
      expect(context.prisma.task.create).toBeCalledTimes(1)
      expect(context.prisma.task.count).toBeCalledTimes(1)
      expect(context.prisma.task.create).toBeCalledWith({
        data: createCallWith,
        include: { list: true },
      })
      expect(context.prisma.task.count).toBeCalledWith({
        where: { listId: 'fakeListId' },
      })
    })
  })

  describe('Test deleteTask', () => {
    const expectingDeleteResult = [
      {
        id: 2,
        listId: 'fakeListId',
        position: 0,
        status: 'in progress',
        title: 'title@#2',
      },
    ]
    const deletingTransactionResult = [
      {
        id: 1,
        title: 'title@#1',
        status: 'in progress',
        listId: 'fakeListId',
        position: 0,
      },
      [
        {
          id: 2,
          title: 'title@#2',
          status: 'in progress',
          listId: 'fakeListId',
          position: 1,
        },
      ],
    ]
    const context: Context = {
      prisma: {
        task: {
          //@ts-ignore
          delete: fn(() => undefined),
          //@ts-ignore
          findMany: fn(() => undefined),
          //@ts-ignore
          update: fn(() => undefined),
        },
        //@ts-ignore
        $transaction: fn(),
      },
    }
    const _parent = {}
    const input = {
      taskId: 1,
      listId: 'fakeListId',
    }

    const deleteTask = resolvers.Mutation?.deleteTask

    beforeAll(() => {
      spyOn(context.prisma, '$transaction')
        .mockResolvedValueOnce(deletingTransactionResult)
        .mockResolvedValueOnce([
          {
            id: 2,
            title: 'title@#2',
            status: 'in progress',
            listId: 'fakeListId',
            position: 0,
          },
        ])
    })

    it('can delete a task', async () => {
      //@ts-ignore
      await expect(deleteTask(_parent, input, context)).resolves.toEqual(
        expectingDeleteResult
      )
      expect(context.prisma.task.delete).toBeCalledTimes(1)
      expect(context.prisma.task.delete).toBeCalledWith({
        where: { id: input.taskId },
      })
      expect(context.prisma.task.findMany).toBeCalledTimes(1)
      expect(context.prisma.task.findMany).toBeCalledWith({
        where: { listId: input.listId },
        orderBy: { position: 'asc' },
      })
      expect(context.prisma.$transaction).toBeCalledTimes(2)
      expect(context.prisma.$transaction).toHaveBeenNthCalledWith(1, [
        undefined,
        undefined,
      ])
      expect(context.prisma.$transaction).toHaveBeenNthCalledWith(2, [
        undefined,
      ])
    })
  })

  describe('Test deleteList', () => {
    const expectingDeleteResult = {
      deletedRole: 1,
    }
    const context: Context = {
      prisma: {
        list: {
          //@ts-ignore
          delete: fn(() => Promise.resolve(undefined)),
        },
      },
    }
    const _parent = {}
    const input = {
      listId: 'fakeListId',
    }

    const deleteList = resolvers.Mutation?.deleteList

    it('can delete a list', async () => {
      //@ts-ignore
      await expect(deleteList(_parent, input, context)).resolves.toEqual(
        expectingDeleteResult
      )
      expect(context.prisma.list.delete).toBeCalledTimes(1)
      expect(context.prisma.list.delete).toBeCalledWith({
        where: { id: input.listId },
      })
    })
  })
})
