import { isValidEmail } from '../shared/email.js'
import { ValidationError } from '../shared/errors.js'
import { generateId } from '../shared/ids.js'

export interface Customer {
  id: string
  userId: string
  name: string
  email: string
  phone?: string
  createdAt: Date
}

export function createCustomer(input: {
  userId: string
  name: string
  email: string
  phone?: string
}): Customer {
  if (!input.name || !input.name.trim())
    throw new ValidationError('Name is required')
  if (!isValidEmail(input.email))
    throw new ValidationError('Invalid email format')

  return {
    id: generateId(),
    userId: input.userId,
    email: input.email,
    name: input.name,
    ...(input.phone !== undefined && { phone: input.phone }),
    createdAt: new Date(),
  }
}
