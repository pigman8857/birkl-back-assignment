import { Resolvers } from 'generated/types'
import { Context } from '../../../libs/context'

export const query: Resolvers<Context>['Query'] = {
  list: async (_parent, { id }, ctx) =>
    ctx.prisma.list.findUnique({
      where: { id },
    }),
}
