import { ValidationError } from '../shared/errors.js'
import { generateId } from '../shared/ids.js'

export interface Customer {
  id: string
  userId: string
  name: string
  email: string
  phone: string | undefined
  createdAt: Date
}

export function createCustomer(input: {
  userId: string
  name: string
  email: string
  phone?: string
}): Customer {
  if (!input.name) throw new ValidationError('Name is required')
  if (!input.email) throw new ValidationError('Email is required')
  return {
    id: generateId(),
    userId: input.userId,
    email: input.email,
    name: input.name,
    phone: input.phone,
    createdAt: new Date(),
  }
}
