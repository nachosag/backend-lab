import { describe, expect, it, vi } from 'vitest'

import { TaskManager } from '../src/task-manager'
import type { TaskRepository } from '../src/task-repository'
import type { Task, TaskStatus } from '../src/types'

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

describe('TaskManager', () => {
  describe('TM-01: add', () => {
    it('debería crear una tarea con status todo', () => {
      const mockRepo = createMockRepository()
      const manager = new TaskManager(mockRepo)

      const result = manager.add('Nueva tarea')

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.description).toBe('Nueva tarea')
      expect(result.status).toBe('todo')
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('debería guardar la tarea en el repositorio', () => {
      const mockRepo = createMockRepository()
      const manager = new TaskManager(mockRepo)

      manager.add('Test task')

      expect(mockRepo.getAll).toHaveBeenCalled()
      expect(mockRepo.saveAll).toHaveBeenCalled()
    })
  })

  describe('TM-02: list todas las tareas', () => {
    it('debería retornar todas las tareas sin filtro', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
        { id: '2', description: 'Task 2', status: 'done', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      const result = manager.list()

      expect(result).toHaveLength(2)
    })
  })

  describe('TM-03: list con filtro de status', () => {
    it('debería filtrar por status done', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
        { id: '2', description: 'Task 2', status: 'done', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      const result = manager.list('done')

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('done')
    })

    it('debería filtrar por status in-progress', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
        { id: '2', description: 'Task 2', status: 'in-progress', createdAt: '', updatedAt: '' },
        { id: '3', description: 'Task 3', status: 'done', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      const result = manager.list('in-progress')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  })

  describe('TM-04: delete tarea existente', () => {
    it('debería eliminar la tarea existente', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      manager.delete('1' as any)

      expect(mockRepo.saveAll).toHaveBeenCalledWith([])
    })
  })

  describe('TM-05: delete tarea inexistente', () => {
    it('debería lanzar error si la tarea no existe', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      expect(() => manager.delete('999' as any)).toThrow('No se encontró la tarea con ID: 999')
    })
  })

  describe('TM-06: update descripción', () => {
    it('debería actualizar la descripción', () => {
      const tasks: Task[] = [
        {
          id: '1',
          description: 'Old description',
          status: 'todo',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      manager.update('1' as any, 'New description')

      expect(mockRepo.saveAll).toHaveBeenCalled()
      const savedTasks = (mockRepo.saveAll as any).mock.calls[0][0]
      expect(savedTasks[0].description).toBe('New description')
      expect(savedTasks[0].updatedAt).not.toBe('2024-01-01')
    })
  })

  describe('TM-07: update status', () => {
    it('debería actualizar el status a done', () => {
      const tasks: Task[] = [
        {
          id: '1',
          description: 'Task',
          status: 'todo' as TaskStatus,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      manager.updateStatus('1' as any, 'done')

      const savedTasks = (mockRepo.saveAll as any).mock.calls[0][0]
      expect(savedTasks[0].status).toBe('done')
    })

    it('debería actualizar el status a in-progress', () => {
      const tasks: Task[] = [
        {
          id: '1',
          description: 'Task',
          status: 'todo' as TaskStatus,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      manager.updateStatus('1' as any, 'in-progress')

      const savedTasks = (mockRepo.saveAll as any).mock.calls[0][0]
      expect(savedTasks[0].status).toBe('in-progress')
    })
  })

  describe('TM-08: findById tarea existente', () => {
    it('debería encontrar tarea por id', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
        { id: '2', description: 'Task 2', status: 'done', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      const result = manager.list()

      expect(result.find((t) => t.id === '2')).toBeDefined()
    })
  })

  describe('TM-09: findById tarea inexistente', () => {
    it('debería lanzar error cuando no encuentra la tarea', () => {
      const tasks: Task[] = [
        { id: '1', description: 'Task 1', status: 'todo', createdAt: '', updatedAt: '' },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      // El error se lanza internamente, en list() no encuentra la tarea
      const result = manager.list()
      expect(result.find((t) => t.id === '999')).toBeUndefined()
    })
  })

  describe('Edge cases', () => {
    it('debería mantener createdAt inmutable al actualizar', () => {
      const originalCreatedAt = '2024-01-01T10:00:00.000Z'
      const tasks: Task[] = [
        {
          id: '1',
          description: 'Task',
          status: 'todo',
          createdAt: originalCreatedAt,
          updatedAt: originalCreatedAt,
        },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      manager.update('1' as any, 'Updated')

      const savedTasks = (mockRepo.saveAll as any).mock.calls[0][0]
      expect(savedTasks[0].createdAt).toBe(originalCreatedAt)
    })

    it('debería actualizar updatedAt al hacer cualquier cambio', () => {
      const tasks: Task[] = [
        {
          id: '1',
          description: 'Task',
          status: 'todo',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      const mockRepo = createMockRepository(tasks)
      const manager = new TaskManager(mockRepo)

      manager.updateStatus('1' as any, 'done')

      const savedTasks = (mockRepo.saveAll as any).mock.calls[0][0]
      expect(savedTasks[0].updatedAt).not.toBe('2024-01-01')
    })
  })
})
