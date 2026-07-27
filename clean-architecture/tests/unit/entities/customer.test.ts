import { expectTypeOf, describe, it, expect } from 'vitest'

import { createCustomer, Customer } from '../../../src/entities/customer'
import { ValidationError } from '../../../src/shared/errors'

describe('createCustomer', () => {
  it('should be a function', () => {
    expectTypeOf(createCustomer).toBeFunction()
  })
  it('should accept the correct fields', () => {
    type param = {
      userId: string
      name: string
      email: string
      phone?: string
    }
    expectTypeOf(createCustomer).parameter(0).toMatchObjectType<param>()
  })
  it('should return a customer', () => {
    expectTypeOf(createCustomer).returns.toEqualTypeOf<Customer>()
  })
  it('should create a customer when fields are valid', () => {
    const data = {
      userId: 'user1234',
      name: 'Ignacio',
      email: 'ignacio@email.com',
      phone: '+54 9 11 2222 3333',
    }
    const customer = createCustomer(data)
    expect(customer).toMatchObject({
      name: data.name,
      email: data.email,
      phone: data.phone,
      userId: data.userId,
      id: expect.any(String),
      createdAt: expect.any(Date),
    })
  })
  it('should create a customer when phone is missing', () => {
    const data = {
      userId: 'user1234',
      name: 'Ignacio',
      email: 'ignacio@email.com',
    }
    const customer = createCustomer(data)
    expect(customer).toMatchObject({
      name: data.name,
      email: data.email,
      userId: data.userId,
      id: expect.any(String),
      createdAt: expect.any(Date),
    })
  })
  it('should throw a ValidationError when name is empty', () => {
    const data = {
      userId: 'user1234',
      name: '',
      email: 'ignacio@email.com',
      phone: '+54 9 11 2222 3333',
    }
    expect(() => createCustomer(data)).toThrow(ValidationError)
  })
  it('should throw a ValidationError when email format is invalid', () => {
    const data = {
      userId: 'user1234',
      name: 'Ignacio',
      email: 'notanemail',
      phone: '+54 9 11 2222 3333',
    }
    expect(() => createCustomer(data)).toThrow(ValidationError)
  })
})
