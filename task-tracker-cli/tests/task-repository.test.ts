import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { TaskRepository } from '../src/task-repository'

describe('TaskRepository', () => {
  let tempDir: string
  let originalCwd: string

  beforeEach(() => {
    // Crear directorio temporal para tests
    tempDir = mkdtempSync(join(tmpdir(), 'task-repo-test-'))
    originalCwd = process.cwd()
    process.chdir(tempDir)
  })

  afterEach(() => {
    // Limpiar y restaurar
    process.chdir(originalCwd)
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  describe('TR-01: getAll con archivo existente', () => {
    it('debería leer tareas del archivo', () => {
      const testTasks = [
        {
          id: '1',
          description: 'Test task',
          status: 'todo' as const,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      writeFileSync(join(tempDir, 'tasks.json'), JSON.stringify(testTasks))

      const repository = new TaskRepository()
      const tasks = repository.getAll()

      expect(tasks).toHaveLength(1)
      expect(tasks[0].description).toBe('Test task')
    })
  })

  describe('TR-02: getAll con archivo vacío', () => {
    it('debería retornar array vacío', () => {
      writeFileSync(join(tempDir, 'tasks.json'), '[]')

      const repository = new TaskRepository()
      const tasks = repository.getAll()

      expect(tasks).toEqual([])
    })
  })

  describe('TR-03: saveAll', () => {
    it('debería escribir tareas en archivo', () => {
      const repository = new TaskRepository()
      const testTasks = [
        {
          id: '1',
          description: 'Task 1',
          status: 'todo' as const,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          description: 'Task 2',
          status: 'done' as const,
          createdAt: '2024-01-02',
          updatedAt: '2024-01-02',
        },
      ]

      repository.saveAll(testTasks)

      const filePath = join(tempDir, 'tasks.json')
      const data = readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(data)

      expect(parsed).toHaveLength(2)
      expect(parsed[0].id).toBe('1')
      expect(parsed[1].status).toBe('done')
    })
  })

  describe('TR-04: Constructor crea archivo si no existe', () => {
    it('debería crear tasks.json si no existe', () => {
      const filePath = join(tempDir, 'tasks.json')
      expect(existsSync(filePath)).toBe(false)

      new TaskRepository()

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf-8')
      expect(content).toBe('[]')
    })
  })

  describe('TR-05: getAll maneja JSON inválido', () => {
    it('debería lanzar error con JSON inválido', () => {
      writeFileSync(join(tempDir, 'tasks.json'), 'invalid json')

      const repository = new TaskRepository()

      // Nota: en el código original, esto hace process.exit(1)
      // Para testing, el código debería manejar el error de otra forma
      expect(() => repository.getAll()).toThrow()
    })
  })
})
