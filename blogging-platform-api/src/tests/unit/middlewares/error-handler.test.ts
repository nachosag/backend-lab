import { describe, it, vi } from 'vitest'

import { errorHandler } from '../../../adapters/inbound/middlewares/error-handler.js'

describe('should be a function', () => {
  it('should be a function', () => {
    expect(errorHandler).toBeInstanceOf(Function)
  })
  it('should have 4 parameters', () => {
    expect(errorHandler.length).toBe(4)
  })
  it('should respond with a 500 code when receives an error', () => {
    const req = {} as any
    const res = makeRes()
    const next = vi.fn()
    const error = new Error('test error')

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'test error' })
  })
})

const makeRes = () =>
  ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }) as any
