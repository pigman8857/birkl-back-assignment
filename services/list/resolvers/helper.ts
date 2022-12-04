
import { Task } from 'generated/types'
export const getReposionedTasks = (taskId: number, taskToReposition: Task, tasks: Task[], newPosition: number, originalPosition: Number): Task[] => {
    console.log('getReposionedTasks >');
    let newTasks: Task[] = [];
    if (newPosition >= originalPosition) {
        //Shift right
        const shiftLeftTasks = tasks.filter(
            task => task.position! <= newPosition && task.id != taskId
        )
        const shiftRightTasks = tasks.filter(task => task.position! > newPosition)
        newTasks = [...shiftLeftTasks, taskToReposition!, ...shiftRightTasks]

        let newPos = 0
        newTasks.forEach(task => (task!.position = newPos++))

    } else if (newPosition < originalPosition) {
        //Shift Left
        const shiftLeftTasks = tasks.filter(task => task.position! < newPosition)
        const shiftRightTasks = tasks.filter(
            task => task.position! >= newPosition && task.id != taskId
        )
        newTasks = [...shiftLeftTasks, taskToReposition!, ...shiftRightTasks]
        let newPos = 0
        newTasks.forEach(task => (task!.position = newPos++))
    }

    return newTasks;
}