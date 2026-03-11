import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { type Task } from './types.js'

export class TaskRepository {
  private readonly filePath = join(process.cwd(), 'tasks.json')

  constructor() {
    if (!existsSync(this.filePath)) {
      this.saveAll([])
    }
  }

  public getAll(): Task[] {
    try {
      const data = readFileSync(this.filePath, 'utf-8')
      return JSON.parse(data) as Task[]
    } catch (error) {
      console.error('Error: no se pudo leer el archivo')
      process.exit(1)
    }
  }

  public saveAll(tasks: Task[]) {
    try {
      const data = JSON.stringify(tasks, null, 2)
      writeFileSync(this.filePath, data, 'utf8')
    } catch (error) {
      console.error('Error: No se pudo escribir en el archivo')
      process.exit(1)
    }
  }
}