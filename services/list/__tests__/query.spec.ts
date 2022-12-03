import { List } from 'generated/types'
import { resolvers } from '../resolvers/index'
import { Context } from '../../../libs/context'
const { fn } = jest

describe('Test List service query', () => {
  const listId = 'fakeId1'

  const findManyResult: List[] = [
    {
      id: listId,
      listName: 'fakeListName1',
      tasks: [
        //@ts-ignore
        {
          title: 'fakeTitle1',
          status: 'fakeStatus',
        },
      ],
    },
    {
        id: 'fakeId2',
        listName: 'fakeListName2',
        tasks: [
          //@ts-ignore
          {
            title: 'fakeTitle1',
            status: 'fakeStatus',
          },
        ],
      },
  ]

  const findUniqueResult = {
    id: listId,
    listName: 'fakeListName1',
    tasks: [
      {
        title: 'fakeTitle1',
        status: 'fakeStatus1',
      },
    ],
  }
  const context: Context = {
    prisma: {
      list: {
        //@ts-ignore
        findMany: fn(() => Promise.resolve(findManyResult)),
        //@ts-ignore
        findUnique: fn(() => Promise.resolve(findUniqueResult)),
      },
    },
  }

  const input = {
    id : listId
  }
  const _parent = {}

  it('get list', async () => {
    const getList = resolvers.Query?.list
    //@ts-ignore
    await expect(getList(_parent, {  }, context)).resolves.toEqual(
        findUniqueResult
    )
  });
  it('get lists', async () => {
    const getLists = resolvers.Query?.lists
    //@ts-ignore
    await expect(getLists(_parent, input, context)).resolves.toEqual(
        findManyResult
    )
  });
})
