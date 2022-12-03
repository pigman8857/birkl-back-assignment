import { Resolvers } from 'generated/types'
import { Context } from '../../../libs/context'

export const mutation: Resolvers<Context>['Mutation'] = {
  createList: async (_parent, { input }, ctx) => {
    const data = {
      listName: input.listName,
      tasks: {
        create: input.tasks,
      },
    }

    return ctx.prisma.list.create({
      data,
      include: { tasks: true },
    })
  },
  updateTask: async (_parent, { taskId, input }, ctx) => {
    const { status, title } = input
    return ctx.prisma.task.update({
      where: { id: taskId },
      data: { status, title },
      include: { list: true },
    })
  },
}
