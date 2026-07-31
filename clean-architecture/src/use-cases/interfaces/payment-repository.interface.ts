import type { Payment } from '../../entities/payment.js'

export interface PaymentRepository {
  findById(id: string): Promise<Payment | null>
  findByOrderId(orderId: string): Promise<Payment | null>
  save(payment: Payment): Promise<Payment>
}
