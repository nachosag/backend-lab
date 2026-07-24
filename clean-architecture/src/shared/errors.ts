export class ValidationError extends Error {
  readonly statusCode: number

  constructor(message?: string) {
    super()

    this.message = message ? message : 'Bad Input'
    this.statusCode = 400
  }
}

export class UnauthorizedError extends Error {
  readonly statusCode: number

  constructor(message?: string) {
    super()

    this.message = message ? message : 'Unauthorized'
    this.statusCode = 401
  }
}

export class ForbiddenError extends Error {
  readonly statusCode: number

  constructor(message?: string) {
    super()

    this.message = message ? message : 'Forbidden'
    this.statusCode = 403
  }
}

export class NotFoundError extends Error {
  readonly statusCode: number

  constructor(message?: string) {
    super()

    this.message = message ? message : 'Resource Not Found'
    this.statusCode = 404
  }
}

export class ConflictError extends Error {
  readonly statusCode: number

  constructor(message?: string) {
    super()

    this.message = message ? message : 'Conflict'
    this.statusCode = 409
  }
}
