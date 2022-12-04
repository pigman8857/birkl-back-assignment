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
  createTask: async (_parent, { input }, ctx) => {
    const { listId, title } = input

    const count = await ctx.prisma.task.count({ where: { listId } })
    return ctx.prisma.task.create({
      data: { title, listId, status: 'to-do', position: count },
      include: { list: true },
    })
  },
  deleteTask: async (_parent, { taskId, listId }, ctx) => {

    const [deletedTask,remainingTasks] = await ctx.prisma.$transaction([
      ctx.prisma.task.delete({ where: { id: taskId } }),
      ctx.prisma.task.findMany({
        where: { listId },
        orderBy: { position: 'asc' },
      }),
    ])
    let position = 0
    const chaNgeTasksPositionOps = remainingTasks.map(task => {
      return ctx.prisma.task.update({
        data: { position: position++ },
        where: { id: task.id },
      })
    })

    const trxResult = await ctx.prisma.$transaction(chaNgeTasksPositionOps)
    console.log('trxResult >',trxResult);
    return { deletedRole: 1 }
  },
  deleteList: async (_parent, { listId }, ctx) => {
    await ctx.prisma.list.delete({
      where: { id: listId },
    })
    return { deletedRole: 1 }
  },
}
