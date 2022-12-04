import { Task } from 'generated/types'
export const getReposionedTasks = (
  taskId: number,
  taskToReposition: Task,
  tasks: Task[],
  newPosition: number,
  originalPosition: Number
): Task[] => {
  const copliedTask = JSON.parse(JSON.stringify(tasks)) as Task[]
  let leftTasks: Task[] = []
  let rightTasks: Task[] = []
  let newPositionTasks: Task[] = []

  //Task go to the right
  if (newPosition >= originalPosition) {
    leftTasks = copliedTask.filter(
      task => task.position! <= newPosition && task.id != taskId
    )
    rightTasks = copliedTask.filter(task => task.position! > newPosition)

    //Task go to the left
  } else if (newPosition < originalPosition) {
    leftTasks = copliedTask.filter(task => task.position! < newPosition)
    rightTasks = copliedTask.filter(
      task => task.position! >= newPosition && task.id != taskId
    )
  }

  newPositionTasks = [...leftTasks, taskToReposition!, ...rightTasks]
  let newPos = 0
  newPositionTasks.forEach(task => (task!.position = newPos++))

  return newPositionTasks
}
