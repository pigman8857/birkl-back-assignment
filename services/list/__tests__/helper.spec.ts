import { getReposionedTasks } from '../resolvers/helper'
import { Task } from 'generated/types'
const {} = jest

describe('Test Helper', () => {
  describe('test getReposionedTasks', () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: 'fakeTitle1',
        status: 'in-progress',
        position: 0,
      },
      {
        id: 2,
        title: 'fakeTitle2',
        status: 'in-progress',
        position: 1,
      },
      {
        id: 3,
        title: 'fakeTitle3',
        status: 'in-progress',
        position: 2,
      },
      {
        id: 4,
        title: 'fakeTitle4',
        status: 'in-progress',
        position: 3,
      },
      {
        id: 5,
        title: 'fakeTitle5',
        status: 'in-progress',
        position: 4,
      },
    ]
    it('Change position of Task #2 to 3', () => {
      const originalPosition = 1
      const newPosition = 3
      const taskId = 2
      const taskToReposition = {
        id: 2,
        title: 'fakeTitle2',
        status: 'in-progress',
        position: 1,
      }

      expect(
        getReposionedTasks(
          taskId,
          taskToReposition,
          tasks,
          newPosition,
          originalPosition
        )
      ).toEqual([
        { id: 1, position: 0, status: 'in-progress', title: 'fakeTitle1' },
        { id: 3, position: 1, status: 'in-progress', title: 'fakeTitle3' },
        { id: 4, position: 2, status: 'in-progress', title: 'fakeTitle4' },
        { id: 2, position: 3, status: 'in-progress', title: 'fakeTitle2' },
        { id: 5, position: 4, status: 'in-progress', title: 'fakeTitle5' },
      ])
    })

    it('Change position of Task #4 to 1', () => {
      const originalPosition = 3
      const newPosition = 1
      const taskId = 4
      const taskToReposition = {
        id: 4,
        title: 'fakeTitle4',
        status: 'in-progress',
        position: 3,
      }

      expect(
        getReposionedTasks(
          taskId,
          taskToReposition,
          tasks,
          newPosition,
          originalPosition
        )
      ).toEqual([
        { id: 1, position: 0, status: 'in-progress', title: 'fakeTitle1' },
        { id: 4, position: 1, status: 'in-progress', title: 'fakeTitle4' },
        { id: 2, position: 2, status: 'in-progress', title: 'fakeTitle2' },
        { id: 3, position: 3, status: 'in-progress', title: 'fakeTitle3' },
        { id: 5, position: 4, status: 'in-progress', title: 'fakeTitle5' },
      ])
    })

    it('Change position of Task #1 to 1', () => {
      const originalPosition = 0
      const newPosition = 1
      const taskId = 1
      const taskToReposition = {
        id: 1,
        title: 'fakeTitle1',
        status: 'in-progress',
        position: 0,
      }

      expect(
        getReposionedTasks(
          taskId,
          taskToReposition,
          tasks,
          newPosition,
          originalPosition
        )
      ).toEqual([
        { id: 2, position: 0, status: 'in-progress', title: 'fakeTitle2' },
        { id: 1, position: 1, status: 'in-progress', title: 'fakeTitle1' },
        { id: 3, position: 2, status: 'in-progress', title: 'fakeTitle3' },
        { id: 4, position: 3, status: 'in-progress', title: 'fakeTitle4' },
        { id: 5, position: 4, status: 'in-progress', title: 'fakeTitle5' },
      ])
    })

    it('Position stay the same', () => {
      const originalPosition = 2
      const newPosition = 2
      const taskId = 3
      const taskToReposition = {
        id: 3,
        title: 'fakeTitle3',
        status: 'in-progress',
        position: 2,
      }

      expect(
        getReposionedTasks(
          taskId,
          taskToReposition,
          tasks,
          newPosition,
          originalPosition
        )
      ).toEqual([
        { id: 1, position: 0, status: 'in-progress', title: 'fakeTitle1' },
        { id: 2, position: 1, status: 'in-progress', title: 'fakeTitle2' },
        { id: 3, position: 2, status: 'in-progress', title: 'fakeTitle3' },
        { id: 4, position: 3, status: 'in-progress', title: 'fakeTitle4' },
        { id: 5, position: 4, status: 'in-progress', title: 'fakeTitle5' },
      ])
    })
  })
})
