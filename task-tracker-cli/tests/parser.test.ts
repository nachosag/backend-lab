import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { parseArguments } from '../src/parser'
import { TaskManager } from '../src/task-manager'
import type { TaskRepository } from '../src/task-repository'
import type { Task } from '../src/types'

// Mock del repositorio
const createMockRepository = (initialTasks: Task[] = []): TaskRepository => {
  let tasks = [...initialTasks]
  return {
    getAll: vi.fn(() => [...tasks]),
    saveAll: vi.fn((newTasks: Task[]) => {
      tasks = newTasks
    }),
  } as unknown as TaskRepository
}

describe('parseArguments', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let mockManager: TaskManager

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('P-01: add con descripción', () => {
    it('debería agregar tarea y mostrar el ID', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['add', 'Nueva tarea'], mockManager)

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Task agregada'))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('ID:'))
    })
  })

  describe('P-02: add sin descripción', () => {
    it('debería mostrar error', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['add'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Falta la descripción de la tarea')
    })
  })

  describe('P-03: update con parámetros', () => {
    it('debería actualizar la descripción', () => {
      const tasks: Task[] = [
        { id: '123', description: 'Old', status: 'todo', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      mockManager = new TaskManager(mockRepo)

      parseArguments(['update', '123', 'New description'], mockManager)

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('P-04: update sin parámetros', () => {
    it('debería mostrar error por falta de descripción (primera validación)', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['update'], mockManager)

      // El parser valida descripción primero, luego id
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Falta la descripción de la tarea')
    })

    it('debería mostrar error por falta de id cuando solo pasa descripción', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['update', '', 'Nueva desc'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Falta el id de la tarea')
    })
  })

  describe('P-05: delete con id', () => {
    it('debería eliminar la tarea', () => {
      const tasks: Task[] = [
        { id: '123', description: 'Task', status: 'todo', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      mockManager = new TaskManager(mockRepo)

      parseArguments(['delete', '123'], mockManager)

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('P-06: delete sin id', () => {
    it('debería mostrar error', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['delete'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Falta el id de la tarea')
    })
  })

  describe('P-07: list sin filtro', () => {
    it('debería listar todas las tareas', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
        { id: '2', description: 'Task 2', status: 'done', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      mockManager = new TaskManager(mockRepo)

      parseArguments(['list'], mockManager)

      expect(consoleLogSpy).toHaveBeenCalled()
      // console.table se usa, verificamos que se llamó
    })

    it('debería mostrar mensaje cuando no hay tareas', () => {
      const mockRepo = createMockRepository([])
      mockManager = new TaskManager(mockRepo)

      parseArguments(['list'], mockManager)

      expect(consoleLogSpy).toHaveBeenCalledWith('No se encontraron tareas')
    })
  })

  describe('P-08: list con filtro válido', () => {
    it('debería filtrar por status done', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
        { id: '2', description: 'Task 2', status: 'done', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      mockManager = new TaskManager(mockRepo)

      parseArguments(['list', 'done'], mockManager)

      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('debería filtrar por status in-progress', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'in-progress', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      mockManager = new TaskManager(mockRepo)

      parseArguments(['list', 'in-progress'], mockManager)

      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('P-09: list con filtro inválido', () => {
    it('debería mostrar error con status inválido', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['list', 'invalid'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error: Status inválido. Usá: todo, in-progress o done.',
      )
    })
  })

  describe('P-10: mark-in-progress', () => {
    it('debería cambiar status a in-progress', () => {
      const tasks: Task[] = [
        { id: '123', description: 'Task', status: 'todo', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      mockManager = new TaskManager(mockRepo)

      parseArguments(['mark-in-progress', '123'], mockManager)

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('debería mostrar error sin id', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['mark-in-progress'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Falta el id de la tarea')
    })
  })

  describe('P-11: mark-done', () => {
    it('debería cambiar status a done', () => {
      const tasks: Task[] = [
        { id: '123', description: 'Task', status: 'todo', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      mockManager = new TaskManager(mockRepo)

      parseArguments(['mark-done', '123'], mockManager)

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('debería mostrar error sin id', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['mark-done'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Falta el id de la tarea')
    })
  })

  describe('P-12: comando desconocido', () => {
    it('debería mostrar mensaje de ayuda', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments(['unknown'], mockManager)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Comando no reconocido.\n Comandos disponibles: add, update, list, delete, mark-in-progress, mark-done',
      )
    })

    it('debería mostrar ayuda sin argumentos', () => {
      const mockRepo = createMockRepository()
      mockManager = new TaskManager(mockRepo)

      parseArguments([], mockManager)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Comando no reconocido.\n Comandos disponibles: add, update, list, delete, mark-in-progress, mark-done',
      )
    })
  })

  describe('Errores del manager', () => {
    it('debería capturar errores del manager y mostrarlos', () => {
      const mockRepo = createMockRepository([])
      mockManager = new TaskManager(mockRepo)

      parseArguments(['update', 'inexistente', 'new desc'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('No se encontró la tarea'),
      )
    })

    it('debería capturar errores de delete de tarea inexistente', () => {
      const mockRepo = createMockRepository([])
      mockManager = new TaskManager(mockRepo)

      parseArguments(['delete', 'inexistente'], mockManager)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('No se encontró la tarea'),
      )
    })
  })
})
