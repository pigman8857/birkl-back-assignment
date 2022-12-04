import { Resolvers, Task } from 'generated/types'
import { Context } from '../../../libs/context'
import { getReposionedTasks} from './helper'

export const mutation: Resolvers<Context>['Mutation'] = {
  createList: async (_parent, { input }, ctx) => {
    let position = 0
    const positionedTask = input.tasks.map(task => {
      return {
        ...task,
        position: position++,
      }
    }, [])

    const data = {
      listName: input.listName,
      tasks: {
        create: positionedTask,
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
    const [__, remainingTasks] = await ctx.prisma.$transaction([
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
    return ctx.prisma.$transaction(chaNgeTasksPositionOps)
  },
  deleteList: async (_parent, { listId }, ctx) => {
    await ctx.prisma.list.delete({
      where: { id: listId },
    })
    return { deletedRole: 1 }
  },
  changeTaskPosition: async (_parent, { taskId, listId, newPosition }, ctx) => {
   
    const [taskToReposition, tasks] = await ctx.prisma.$transaction([
      ctx.prisma.task.findUnique({ where: { id: taskId } }),
      ctx.prisma.task.findMany({
        where: {
          listId: listId,
        },
        orderBy: { position: 'asc' },
      }),
    ])
 
    if(!taskToReposition)
      throw new Error(`Entry with task Id ${taskId} does not exist`);

    const originalPosition = taskToReposition!.position
    let newTasks: Task[] = getReposionedTasks(taskId,taskToReposition!,tasks,newPosition,originalPosition);
    
    const repositionOps = newTasks.map(task => {
      const { id, status, title, position } = task as {
        id: number
        status: string
        title: string
        position: number
      }
      return ctx.prisma.task.update({
        data: { status, title, position },
        where: { id },
      })
    }, [])
    
    const trx = await ctx.prisma.$transaction([
      ...repositionOps,
      ctx.prisma.task.findMany({
        where: {
          listId,
        },
        orderBy: { position: 'asc' },
      })
    ])
    const result = trx[trx.length-1] as Task[];
    return result
  },
}
