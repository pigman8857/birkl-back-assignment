import { Resolvers, List} from 'generated/types'
import { Context } from '../../../libs/context'

export const mutation: Resolvers<Context>['Mutation'] = {
  createList: async (_parent, { input } , ctx) => {
    console.log('createList mutation input >',input);
    const result = await ctx.prisma.list.create({ data : input});

    return result;
  }
}
