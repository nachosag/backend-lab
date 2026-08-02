import type { Payment } from '../../../entities/payment.js'
import type { PaymentRepository } from '../../../use-cases/interfaces/payment-repository.interface.js'

export class InMemoryPaymentRepository implements PaymentRepository {
  private store = new Map<string, Payment>()

  async findById(id: string): Promise<Payment | null> {
    const payment = this.store.get(id)

    if (!payment) return null

    return payment
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    for (const payment of this.store.values()) {
      if (payment.orderId === orderId) return payment
    }

    return null
  }

  async save(payment: Payment): Promise<Payment> {
    this.store.set(payment.id, payment)

    return payment
  }
}
