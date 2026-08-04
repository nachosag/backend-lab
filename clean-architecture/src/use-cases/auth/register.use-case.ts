import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import { createCustomer } from '../../entities/customer.js'
import { createUser } from '../../entities/user.js'
import { ConflictError, ValidationError } from '../../shared/errors.js'
import type { CustomerRepository } from '../interfaces/customer-repository.interface.js'
import type { UserRepository } from '../interfaces/user-repository.interface.js'
import type { RegisterInput, RegisterOutput } from './auth.dto.js'

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly jwtSecret: string,
    private readonly saltRounds: number = 12,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    if (input.password.length < 8)
      throw new ValidationError('Password must be at least 8 characters')

    if (await this.userRepo.findByEmail(input.email))
      throw new ConflictError('Email already in use')

    const user = createUser({
      email: input.email,
      passwordHash: await hash(input.password, this.saltRounds),
    })

    await this.userRepo.save(user)

    const customer = createCustomer({
      email: user.email,
      name: input.name,
      userId: user.id,
      ...(input.phone !== undefined && { phone: input.phone }),
    })

    await this.customerRepo.save(customer)

    const token = sign(
      {
        userId: customer.userId,
        email: customer.email,
      },
      this.jwtSecret,
      { expiresIn: '24h' },
    )

    return {
      token: token,
      customerId: customer.id,
      userId: customer.userId,
    }
  }
}
