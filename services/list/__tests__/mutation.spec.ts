import { List } from 'generated/types'
import { resolvers } from '../resolvers/index'
import { Context } from '../../../libs/context'
import * as Helper from '../resolvers/helper'
const { fn, spyOn, clearAllMocks } = jest

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
      tasks: [
        {
          title: 'fakeTitle',
          status: 'TO_DO',
        },
      ],
    }

    const expectingTaskCreate = [
      {
        title: 'fakeTitle',
        status: 'TO_DO',
        position: 0,
      },
    ]

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
            create: expectingTaskCreate,
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
      status: 'TO_DO',
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
        include: { list: { include: { tasks: true } } },
      })
    })
  })

  describe('Test createTask', () => {
    const createResult = {
      id: 1,
      status: 'TO_DO',
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
      status: 'TO_DO',
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
        include: { list: { include: { tasks: true } } },
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
        status: 'TO_DO',
        title: 'title@#2',
      },
    ]
    const deletingTransactionResult = [
      {
        id: 1,
        title: 'title@#1',
        status: 'TO_DO',
        listId: 'fakeListId',
        position: 0,
      },
      [
        {
          id: 2,
          title: 'title@#2',
          status: 'TO_DO',
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
            status: 'TO_DO',
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

  describe('test changeTaskPosition', () => {
    const findManyTasks = [
      {
        id: 1,
        title: 'fakeTitle1',
        status: 'IN_PROGRESS',
        position: 0,
      },
      {
        id: 2,
        title: 'fakeTitle2',
        status: 'IN_PROGRESS',
        position: 1,
      },
      {
        id: 3,
        title: 'fakeTitle3',
        status: 'IN_PROGRESS',
        position: 2,
      },
      {
        id: 4,
        title: 'fakeTitle4',
        status: 'IN_PROGRESS',
        position: 3,
      },
      {
        id: 5,
        title: 'fakeTitle5',
        status: 'IN_PROGRESS',
        position: 4,
      },
    ]
    const context: Context = {
      prisma: {
        task: {
          //@ts-ignore
          findUnique: fn(() => undefined),
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

    const changeTaskPosition = resolvers.Mutation?.changeTaskPosition

    afterAll(() => {
      clearAllMocks()
    })

    it('Can change position and update', async () => {
      const repositionedTasks = [
        {
          id: 1,
          title: 'fakeTitle1',
          status: 'IN_PROGRESS',
          position: 0,
        },
        {
          id: 3,
          title: 'fakeTitle3',
          status: 'IN_PROGRESS',
          position: 1,
        },
        {
          id: 2,
          title: 'fakeTitle2',
          status: 'IN_PROGRESS',
          position: 2,
        },
        {
          id: 4,
          title: 'fakeTitle4',
          status: 'IN_PROGRESS',
          position: 3,
        },
        {
          id: 5,
          title: 'fakeTitle5',
          status: 'IN_PROGRESS',
          position: 4,
        },
      ]
      spyOn(Helper, 'getReposionedTasks').mockReturnValueOnce(repositionedTasks)
      spyOn(context.prisma, '$transaction')
        .mockResolvedValueOnce([
          {
            id: 2,
            title: 'fakeTitle3',
            status: 'IN_PROGRESS',
            position: 1,
          },
          findManyTasks,
        ])
        .mockResolvedValueOnce([{}, {}, {}, {}, {}, repositionedTasks])

      const input = {
        newPosition: 3,
        taskId: 2,
        listId: 'fakeListId',
      }
      await expect(
        //@ts-ignore
        changeTaskPosition(_parent, input, context)
      ).resolves.toEqual(repositionedTasks)

      expect(context.prisma.task.findUnique).toHaveBeenCalledTimes(1)
      expect(context.prisma.task.findUnique).toBeCalledWith({
        where: {
          id: input.taskId,
        },
      })
      expect(context.prisma.task.findMany).toHaveBeenCalledTimes(2)
      expect(context.prisma.task.findMany).toHaveBeenNthCalledWith(1, {
        where: {
          listId: input.listId,
        },
        orderBy: { position: 'asc' },
      })
      expect(context.prisma.task.findMany).toHaveBeenNthCalledWith(2, {
        where: {
          listId: input.listId,
        },
        orderBy: { position: 'asc' },
      })

      expect(context.prisma.task.update).toHaveBeenCalledTimes(5)
      expect(context.prisma.task.update).toHaveBeenNthCalledWith(1, {
        data: {
          title: 'fakeTitle1',
          status: 'IN_PROGRESS',
          position: 0,
        },
        where: { id: 1 },
      })
      expect(context.prisma.task.update).toHaveBeenNthCalledWith(2, {
        data: {
          title: 'fakeTitle3',
          status: 'IN_PROGRESS',
          position: 1,
        },
        where: { id: 3 },
      })
      expect(context.prisma.task.update).toHaveBeenNthCalledWith(3, {
        data: {
          title: 'fakeTitle2',
          status: 'IN_PROGRESS',
          position: 2,
        },
        where: { id: 2 },
      })
      expect(context.prisma.task.update).toHaveBeenNthCalledWith(4, {
        data: {
          title: 'fakeTitle4',
          status: 'IN_PROGRESS',
          position: 3,
        },
        where: { id: 4 },
      })
      expect(context.prisma.task.update).toHaveBeenNthCalledWith(5, {
        data: {
          title: 'fakeTitle5',
          status: 'IN_PROGRESS',
          position: 4,
        },
        where: { id: 5 },
      })

      expect(context.prisma.$transaction).toHaveBeenCalledTimes(2)
      expect(context.prisma.$transaction).toHaveBeenNthCalledWith(1, [
        undefined,
        undefined,
      ])
      expect(context.prisma.$transaction).toHaveBeenNthCalledWith(2, [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ])
    })

    it('Can change task id = 2 to new position 3', async () => {
      const input = {
        newPosition: 3,
        taskId: 2,
        listId: 'fakeListId',
      }
      spyOn(context.prisma, '$transaction').mockResolvedValueOnce([
        undefined,
        findManyTasks,
      ])
      await expect(
        //@ts-ignore
        changeTaskPosition(_parent, input, context)
      ).rejects.toThrow(new Error('Entry with task Id 2 does not exist'))
    })
  })
})
