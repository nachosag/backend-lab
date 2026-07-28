import { describe, expect, it } from 'vitest'

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../../shared/errors.js'

describe('Error clases', () => {
  it.each([
    [ValidationError, 400],
    [UnauthorizedError, 401],
    [NotFoundError, 404],
    [ForbiddenError, 403],
    [ConflictError, 409],
  ])('%s has statusCode %d', (ErrorClass, expectedStatus) => {
    const error = new ErrorClass()
    expect(error).toBeInstanceOf(Error)
    expect(error.statusCode).toBe(expectedStatus)
  })
})
