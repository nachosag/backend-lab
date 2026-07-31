import {
  createPayment,
  PaymentMethod,
  type Payment,
} from '../../../entities/payment.js'

export function aPayment(overrides: Partial<Payment> = {}): Payment {
  return {
    ...createPayment({
      amount: 2000,
      method: PaymentMethod.CASH,
      orderId: 'test123',
    }),
    ...overrides,
  }
}
