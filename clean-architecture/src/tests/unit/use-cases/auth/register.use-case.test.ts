import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { ConflictError, ValidationError } from '../../../../shared/errors.js'
import type { RegisterInput } from '../../../../use-cases/auth/auth.dto.js'
import { RegisterUserUseCase } from '../../../../use-cases/auth/register.use-case.js'
import type { CustomerRepository } from '../../../../use-cases/interfaces/customer-repository.interface.js'
import type { UserRepository } from '../../../../use-cases/interfaces/user-repository.interface.js'
import { aUser } from '../../../factories/entities/user.factory.js'
import { makeCustomerRepository } from '../../../factories/repositories/customer-repository.factory.js'
import { makeUserRepository } from '../../../factories/repositories/user-repository.factory.js'

describe('RegisterUserUseCase', () => {
  let registerUC: RegisterUserUseCase
  let userRepo: UserRepository
  let customerRepo: CustomerRepository

  beforeAll(() => {
    userRepo = makeUserRepository()
    customerRepo = makeCustomerRepository()

    registerUC = new RegisterUserUseCase(
      userRepo,
      customerRepo,
      'ultraSecret',
      1,
    )
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register an user', async () => {
    const input: RegisterInput = {
      email: 'test@example.com',
      password: '12345678',
      name: 'Test User',
    }

    vi.mocked(userRepo.findByEmail).mockResolvedValue(null)
    vi.mocked(userRepo.save).mockImplementation(async (user) => user)
    vi.mocked(customerRepo.save).mockImplementation(
      async (customer) => customer,
    )

    const output = await registerUC.execute(input)

    // Output shape
    expect(output.token).toBeTypeOf('string')
    expect(output.token.length).toBeGreaterThan(0)
    expect(output.userId).toBeTypeOf('string')
    expect(output.customerId).toBeTypeOf('string')

    // The email existence check must run against the input
    expect(userRepo.findByEmail).toHaveBeenCalledWith(input.email)

    // User saved once, with a hashed password
    expect(userRepo.save).toHaveBeenCalledTimes(1)
    const savedUser = vi.mocked(userRepo.save).mock.calls[0]![0]
    expect(savedUser.email).toBe(input.email)
    expect(savedUser.passwordHash).not.toBe(input.password)
    await expect(
      bcrypt.compare(input.password, savedUser.passwordHash),
    ).resolves.toBe(true)

    // Customer saved once, linked to the created user
    expect(customerRepo.save).toHaveBeenCalledTimes(1)
    const savedCustomer = vi.mocked(customerRepo.save).mock.calls[0]![0]
    expect(savedCustomer.userId).toBe(output.userId)

    // Token carries { userId, email } and expires in ~24h
    const payload = jwt.verify(output.token, 'ultraSecret') as {
      userId: string
      email: string
      iat: number
      exp: number
    }
    expect(payload.userId).toBe(output.userId)
    expect(payload.email).toBe(input.email)
    expect(payload.exp - payload.iat).toBeGreaterThanOrEqual(86399)
    expect(payload.exp - payload.iat).toBeLessThanOrEqual(86400)
  })

  it('should throw ConflictError when email already exists', async () => {
    const input: RegisterInput = {
      email: 'test@example.com',
      password: '12345678',
      name: 'Test User',
    }

    vi.mocked(userRepo.findByEmail).mockResolvedValue(
      aUser({ email: input.email }),
    )

    await expect(registerUC.execute(input)).rejects.toThrow(ConflictError)

    expect(userRepo.save).not.toHaveBeenCalled()
  })
  it('should throw ValidationError when password < 8 chars', async () => {
    const input: RegisterInput = {
      email: 'test@example.com',
      password: '1234567',
      name: 'Test User',
    }

    await expect(registerUC.execute(input)).rejects.toThrow(ValidationError)

    expect(userRepo.findByEmail).not.toHaveBeenCalled()
  })
})
