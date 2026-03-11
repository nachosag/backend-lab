import { TaskManager } from "./task-manager.js";
import type { UUID } from "node:crypto";
import type { Task, TaskStatus } from "./types.js";

export function parseArguments(args: string[], manager: TaskManager): void {
  const [command, ...params] = args

  try {
    switch (command) {
      case 'add': {
        const description = params[0]
        
        if (!description) {
          console.error('Error: Falta la descripción de la tarea')
          return
        }

        const task = manager.add(description)
        console.log(`Task agregada - ID: ${task.id}`)
        break;
      }
    
      case 'update': {
        const id = params[0]
        const descripcion = params[1]

        if (!descripcion) {
          console.error('Error: Falta la descripción de la tarea')
          return
        }

        if (!id) {
          console.error('Error: Falta el id de la tarea')
          return
        }

        manager.update(id as UUID, descripcion)
        break
      }
      
      case 'delete': {
        const id = params[0]

        if (!id) {
          console.error('Error: Falta el id de la tarea')
          return
        }

        manager.delete(id as UUID)
        break
      }

      case 'list': {
        const statusFilter = params[0] as TaskStatus | undefined
        const validStatuses = ['todo', 'in-progress', 'done']
        if (statusFilter && !validStatuses.includes(statusFilter)) {
          console.error('Error: Status inválido. Usá: todo, in-progress o done.');
          return
        }
        
        const tasks: Task[] = manager.list(statusFilter)

        if (tasks.length === 0) {
          console.log('No se encontraron tareas')
          return
        }

        console.table(tasks)
        break
      }

      case 'mark-in-progress':
      case 'mark-done': {
        const id = params[0]
        
        if (!id) {
          console.error('Error: Falta el id de la tarea')
          return
        }

        const status: TaskStatus = command === 'mark-done' ? 'done' : 'in-progress'
        manager.updateStatus(id as UUID, status)
        break
      }

      default:
        console.log('Comando no reconocido.\n Comandos disponibles: add, update, list, delete, mark-in-progress, mark-done')
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Hubo un error')
  }
}

