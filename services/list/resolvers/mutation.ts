import { Resolvers, Task } from 'generated/types'
import { Context } from '../../../libs/context'
import { getReposionedTasks } from './helper'
import { TaskStatus } from '@prisma/client'

export const mutation: Resolvers<Context>['Mutation'] = {
  createList: async (_parent, { input }, ctx) => {
    let position = 0
    const positionedTask = input.tasks.map(task => {
      const __status : TaskStatus = task.status as TaskStatus;
      console.log('__status');
      return {
        ...task,
        status:__status,
        position: position++,
      }
    }, [])

    return ctx.prisma.list.create({
      data : {
        listName: input.listName,
        tasks : {
          create : positionedTask
        }
      },
    })
  },
  updateTask: async (_parent, { taskId, input }, ctx) => {
    const { status, title } = input
    const __status : TaskStatus = status as TaskStatus;
    return ctx.prisma.task.update({
      where: { id: taskId },
      data: { status: __status, title },
      include: { list: true },
    })
  },
  createTask: async (_parent, { input }, ctx) => {
    const { listId, title } = input

    const count = await ctx.prisma.task.count({ where: { listId } })
    return ctx.prisma.task.create({
      data: { title, listId, status: TaskStatus.TO_DO, position: count },
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

    if (!taskToReposition)
      throw new Error(`Entry with task Id ${taskId} does not exist`)

    const originalPosition = taskToReposition!.position
    let newPositionTasks: Task[] = getReposionedTasks(
      taskId,
      taskToReposition!,
      tasks,
      newPosition,
      originalPosition
    )

    const repositionOps = newPositionTasks.map(task => {
      const { id, status, title, position } = task as {
        id: number
        status: string
        title: string
        position: number
      }
      const __status : TaskStatus = status as TaskStatus;
    
      return ctx.prisma.task.update({
        data: { status:__status, title, position },
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
      }),
    ])
    const result = trx[trx.length - 1] as Task[]
    return result
  },
}
