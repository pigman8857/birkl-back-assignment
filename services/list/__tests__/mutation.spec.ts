import { List, Task } from 'generated/types'
import { resolvers } from '../resolvers/index'
import { Context } from '../../../libs/context'
const { fn } = jest

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
    const createResult: Task = {
      id: 1,
      status: 'to-do',
      title: 'fakeTitle',
    }
    const context: Context = {
      prisma: {
        task: {
          //@ts-ignore
          create: fn(() => Promise.resolve(createResult)),
        },
      },
    }
    const _parent = {}
    const input = {
      title: 'fakeTitle',
      status: 'to-do',
      listId: 'fakeListId',
    }

    const createTask = resolvers.Mutation?.createTask

    it('can create task', async () => {
      //@ts-ignore
      await expect(createTask(_parent, { input }, context)).resolves.toEqual(
        createResult
      )
      expect(context.prisma.task.create).toBeCalledTimes(1)
      expect(context.prisma.task.create).toBeCalledWith({
        data: input,
        include: { list: true },
      })
    })
  })
})
