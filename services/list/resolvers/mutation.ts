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

    const result = await ctx.prisma.list.create({
      data,
      include: {tasks : true}
    })
  
    return result
  },
  updateTask: async (_parent, { taskId , input } , ctx) => {
    console.log('updateTask() mutation taskId,input>',taskId,input);
    return {success : false}
  }
}
