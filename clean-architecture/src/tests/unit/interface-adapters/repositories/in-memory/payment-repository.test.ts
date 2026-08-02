import { beforeAll, describe, expect, it } from 'vitest'

import { InMemoryPaymentRepository } from '../../../../../interface-adapters/repositories/in-memory/payment-repository.js'
import { aPayment } from '../../../../factories/entities/payment.factory.js'

describe('InMemoryPaymentRepository', () => {
  let payments: ReturnType<typeof aPayment>[]
  let repo: InMemoryPaymentRepository

  beforeAll(async () => {
    payments = [aPayment(), aPayment(), aPayment()]
    repo = new InMemoryPaymentRepository()
    await Promise.all(payments.map((payment) => repo.save(payment)))
  })
  it('should find payment by id', async () => {
    expect(await repo.findById(payments[0]!.id)).toEqual(payments[0])
  })
  it('should find payment by order id', async () => {
    expect(await repo.findByOrderId(payments[0]!.orderId)).toEqual(payments[0])
  })
  it('should round trip a payment', async () => {
    const payment = aPayment()
    const result = await repo.save(payment)
    expect(result).toEqual(payment)
    expect(await repo.findById(payment.id)).toEqual(result)
  })
})
