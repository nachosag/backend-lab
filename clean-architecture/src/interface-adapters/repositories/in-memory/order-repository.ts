import type { OrderStatus } from '../../../entities/order-status.js'
import type { Order } from '../../../entities/order.js'
import type { OrderRepository } from '../../../use-cases/interfaces/order-repository.interface.js'

export class InMemoryOrderRepository implements OrderRepository {
  private store = new Map<string, Order>()

  async findAll(filter?: {
    customerId?: string
    status?: OrderStatus
  }): Promise<Order[]> {
    return this.store
      .values()
      .toArray()
      .filter((order) => {
        if (filter?.status && order.status !== filter.status) return false
        if (filter?.customerId && order.customerId !== filter.customerId)
          return false
        return true
      })
  }

  async findByCustomerId(
    customerId: string,
    status?: OrderStatus,
  ): Promise<Order[]> {
    if (!status) return this.findAll({ customerId })

    return this.findAll({ customerId, status })
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.store.get(id)

    if (!order) return null

    return order
  }

  async save(order: Order): Promise<Order> {
    this.store.set(order.id, order)

    return order
  }
}
