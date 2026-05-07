import { describe, expect, it } from 'vitest'

import type { Task, TaskStatus } from '../src/types'

describe('types', () => {
  describe('TaskStatus', () => {
    it('debería tener valores válidos: todo, in-progress, done', () => {
      const validStatuses: TaskStatus[] = ['todo', 'in-progress', 'done']

      expect(validStatuses).toContain('todo')
      expect(validStatuses).toContain('in-progress')
      expect(validStatuses).toContain('done')
    })
  })

  describe('Task interface', () => {
    it('debería tener todos los campos requeridos', () => {
      const task: Task = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Test task',
        status: 'todo',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }

      expect(task.id).toBeDefined()
      expect(task.description).toBeDefined()
      expect(task.status).toBeDefined()
      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
    })

    it('debería permitir status válido', () => {
      const taskTodo: Task = {
        id: '1',
        description: 'test',
        status: 'todo',
        createdAt: '',
        updatedAt: '',
      }

      const taskInProgress: Task = {
        ...taskTodo,
        status: 'in-progress',
      }

      const taskDone: Task = {
        ...taskTodo,
        status: 'done',
      }

      expect(taskTodo.status).toBe('todo')
      expect(taskInProgress.status).toBe('in-progress')
      expect(taskDone.status).toBe('done')
    })
  })
})
