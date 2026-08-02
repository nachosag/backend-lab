import { beforeAll, describe, expect, it } from 'vitest'

import { InMemoryCustomerRepository } from '../../../../../interface-adapters/repositories/in-memory/customer-repository.js'
import { aCustomer } from '../../../../factories/entities/customer.factory.js'

describe('InMemoryCustomerRepository', () => {
  let repo: InMemoryCustomerRepository
  let customers: ReturnType<typeof aCustomer>[]

  beforeAll(async () => {
    repo = new InMemoryCustomerRepository()
    customers = [aCustomer(), aCustomer(), aCustomer()]
    await Promise.all(customers.map((customer) => repo.save(customer)))
  })

  it('should find customer by userId', async () => {
    expect(await repo.findByUserId(customers[0]!.userId)).toEqual(customers[0])
  })
  it('should find customer by id', async () => {
    expect(await repo.findById(customers[0]!.id)).toEqual(customers[0])
  })
  it('should find all customers', async () => {
    expect(await repo.findAll()).toEqual(customers)
  })
  it('should round trip a customer', async () => {
    const customer = aCustomer()
    await repo.save(customer)
    const found = await repo.findById(customer.id)
    expect(found).toEqual(customer)
  })
  it(`should update customer's name`, async () => {
    expect(
      (
        await repo.update(customers[0]!.id, {
          name: 'new-testing-name',
        })
      ).name,
    ).toBe('new-testing-name')
  })
  it(`should update customer's phone`, async () => {
    expect(
      (
        await repo.update(customers[0]!.id, {
          phone: '+54 9 11 3333 4444',
        })
      ).phone,
    ).toBe('+54 9 11 3333 4444')
  })
})
