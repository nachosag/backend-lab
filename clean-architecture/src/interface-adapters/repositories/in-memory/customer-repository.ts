import type { Customer } from '../../../entities/customer.js'
import { NotFoundError } from '../../../shared/errors.js'
import type { CustomerRepository } from '../../../use-cases/interfaces/customer-repository.interface.js'

export class InMemoryCustomerRepository implements CustomerRepository {
  private store = new Map<string, Customer>()

  async findAll(): Promise<Customer[]> {
    return this.store.values().toArray()
  }

  async findById(id: string): Promise<Customer | null> {
    return this.store.get(id) ?? null
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    for (const customer of this.store.values()) {
      if (customer.userId === userId) return customer
    }

    return null
  }

  async save(customer: Customer): Promise<Customer> {
    this.store.set(customer.id, customer)

    return customer
  }

  async update(
    id: string,
    patch: Partial<Pick<Customer, 'name' | 'phone'>>,
  ): Promise<Customer> {
    const customer = await this.findById(id)

    if (!customer) throw new NotFoundError('Customer not found')

    Object.assign(customer, patch)

    this.store.set(customer.id, customer)

    return customer
  }
}
