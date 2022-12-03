import { List } from 'generated/types'
import { resolvers } from '../resolvers/index'
import { Context } from '../../../libs/context'
const { fn } = jest

describe('Test List service mutation', () => {
  console.log('resolvers.Mutation ',resolvers.Mutation);

 

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

    const createList = resolvers.Mutation?.createList;

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
  });

  describe('Test updateTask', () => {

    const updateTask = resolvers.Mutation?.updateTask;
    const taskId = 1;
    const input = {
      title : 'updatedFakeTitle',
      status : 'updatedStatus'
    }
    const context: Context = {
      prisma: {
        list: {
          //@ts-ignore
          update: fn(() => Promise.resolve()),
        },
      },
    }
    const _parent = {}
    it('Can update task', async () => {
      console.log('updateTask>',updateTask);

      //@ts-ignore
      await expect(updateTask(_parent, { input }, context)).resolves.toEqual({
        success: true,
      })
    });

  })
});
