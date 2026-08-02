import { beforeAll, describe, expect, it } from 'vitest'

import { OrderStatus } from '../../../../../entities/order-status.js'
import { InMemoryOrderRepository } from '../../../../../interface-adapters/repositories/in-memory/order-repository.js'
import { aOrder } from '../../../../factories/entities/order.factory.js'

describe('InMemoryOrderRepository', () => {
  let repo: InMemoryOrderRepository
  let orders: ReturnType<typeof aOrder>[]

  beforeAll(async () => {
    repo = new InMemoryOrderRepository()
    orders = [
      aOrder({ customerId: 'customer-1', status: OrderStatus.PENDING }),
      aOrder({ customerId: 'customer-1', status: OrderStatus.CONFIRMED }),
      aOrder({ customerId: 'customer-2', status: OrderStatus.PENDING }),
    ]

    await Promise.all(orders.map((order) => repo.save(order)))
  })

  it('should find all orders without filter', async () => {
    expect(await repo.findAll()).toEqual(orders)
  })

  it('should find all orders filtered by status', async () => {
    expect(await repo.findAll({ status: OrderStatus.PENDING })).toEqual([
      orders[0],
      orders[2],
    ])
  })

  it('should find all orders filtered by customerId', async () => {
    expect(await repo.findAll({ customerId: 'customer-1' })).toEqual([
      orders[0],
      orders[1],
    ])
  })

  it('should find all orders filtered by status and customerId', async () => {
    expect(
      await repo.findAll({
        status: OrderStatus.PENDING,
        customerId: 'customer-1',
      }),
    ).toEqual([orders[0]])
  })

  it('should return an empty array when no order matches the filter', async () => {
    expect(await repo.findAll({ status: OrderStatus.CANCELLED })).toEqual([])
  })

  it('should find orders by customerId', async () => {
    expect(await repo.findByCustomerId('customer-2')).toEqual([orders[2]])
  })

  it('should find orders by customerId and status', async () => {
    expect(
      await repo.findByCustomerId('customer-1', OrderStatus.CONFIRMED),
    ).toEqual([orders[1]])
  })

  it('should return an empty array when customer has no orders with the status', async () => {
    expect(
      await repo.findByCustomerId('customer-1', OrderStatus.CANCELLED),
    ).toEqual([])
  })

  it('should find an order by id', async () => {
    expect(await repo.findById(orders[0]!.id)).toEqual(orders[0])
  })

  it('should round trip an order', async () => {
    const order = aOrder()
    const result = await repo.save(order)
    expect(result).toEqual(order)
    expect(await repo.findById(order.id)).toEqual(order)
  })
})
