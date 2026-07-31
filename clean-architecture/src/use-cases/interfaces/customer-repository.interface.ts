import type { Customer } from '../../entities/customer.js'

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>
  findByUserId(userId: string): Promise<Customer | null>
  findAll(): Promise<Customer[]>
  save(customer: Customer): Promise<Customer>
  update(
    id: string,
    patch: Partial<Pick<Customer, 'name' | 'phone'>>,
  ): Promise<Customer>
}
