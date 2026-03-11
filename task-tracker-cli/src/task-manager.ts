import { randomUUID, type UUID } from "node:crypto";
import type { TaskRepository } from "./task-repository.js";
import type { Task, TaskStatus } from "./types.js";

export class TaskManager {
  private repository: TaskRepository

  constructor(repo: TaskRepository) {
    this.repository = repo
  }

  public add(description: string): Task {
    const tasks: Task[] = this.repository.getAll()
    
    const newTask: Task = {
      id: randomUUID(),
      description,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    tasks.push(newTask)
    this.repository.saveAll(tasks)

    return newTask
  }

  public list(status?: TaskStatus): Task[] {
    const tasks: Task[] = this.repository.getAll()

    if (status) {
      return tasks.filter(task => task.status === status)
    }

    return tasks
  }

  public delete(id: UUID): void {
    const tasks: Task[] = this.repository.getAll()
    const filteredTasks: Task[] = tasks.filter(t => t.id !== id)

    if (tasks.length === filteredTasks.length) {
      throw new Error(`Error: No se encontró la tarea con ID: ${id}`)
    }

    this.repository.saveAll(filteredTasks)
  }

  public update(id: UUID, description: string): void {
    const tasks: Task[] = this.repository.getAll()
    const task: Task = this.findById(tasks, id)

    task.description = description
    task.updatedAt = new Date().toISOString()

    this.repository.saveAll(tasks)
  }

  public updateStatus(id: UUID, status: TaskStatus): void {
    const tasks: Task[] = this.repository.getAll()
    const task: Task = this.findById(tasks, id)

    task.status = status
    task.updatedAt = new Date().toISOString()

    this.repository.saveAll(tasks)
  }

  private findById(tasks: Task[], id: string): Task {
    const task: Task | undefined = tasks.find(t => t.id === id)

    if (!task) {
      throw new Error(`Error: No se encontró la tarea con ID: ${id}`)
    }

    return task
  }
}