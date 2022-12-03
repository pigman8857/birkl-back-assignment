import { List } from 'generated/types'
import { resolvers } from '../resolvers/index';
import { Context } from '../../../libs/context'
const { fn } = jest;

describe('Test List service mutation', () => {
    const createResult : List = {
        "id": "fakeId",
        "listName": "fakeListName"
    }
    const context : Context = {
        prisma : {
            list : {
                //@ts-ignore
                create : fn(() => Promise.resolve(createResult))
            }
        }
    }
    const _parent = {}
    const input = {
        listName : 'fakeListName',
        tasks : {
            title:'fakeTitle',
            status: 'fakeStatus'
        }
    }
    it('createList', async () => {
       const createList = resolvers.Mutation?.createList
        //@ts-ignore
        await expect(createList(_parent,{input},context)).resolves.toEqual(createResult);
    });
});