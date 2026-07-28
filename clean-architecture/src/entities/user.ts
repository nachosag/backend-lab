import { isValidEmail } from '../shared/email.js'
import { ValidationError } from '../shared/errors.js'
import { generateId } from '../shared/ids.js'

export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
}

export function createUser(input: {
  email: string
  passwordHash: string
}): User {
  if (!isValidEmail(input.email))
    throw new ValidationError('Invalid email format')
  return {
    id: generateId(),
    email: input.email,
    passwordHash: input.passwordHash,
    createdAt: new Date(),
  }
}
