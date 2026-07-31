import type { OrderStatus } from '../../entities/order-status.js'
import type { Order } from '../../entities/order.js'

export interface OrderRepository {
  findById(id: string): Promise<Order | null>
  findByCustomerId(customerId: string, status?: OrderStatus): Promise<Order[]>
  findAll(filter?: {
    status?: OrderStatus
    customerId?: string
  }): Promise<Order[]>
  save(order: Order): Promise<Order>
}
