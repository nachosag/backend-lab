import { beforeAll, describe, expect, it } from 'vitest'

import { InMemoryProductRepository } from '../../../../../interface-adapters/repositories/in-memory/product-repository.js'
import { aProduct } from '../../../../factories/entities/product.factory.js'

describe('InMemoryProductRepository', () => {
  let repo: InMemoryProductRepository
  let products: ReturnType<typeof aProduct>[]

  beforeAll(async () => {
    repo = new InMemoryProductRepository()
    products = [aProduct(), aProduct(), aProduct()]

    await Promise.all(products.map((product) => repo.save(product)))
  })
  it('should find all products', async () => {
    expect(await repo.findAll()).toEqual(products)
  })
  it('should find product by id', async () => {
    expect(await repo.findById(products[0]!.id)).toEqual(products[0])
  })
  it('should find product by sku', async () => {
    expect(await repo.findBySku(products[0]!.sku)).toEqual(products[0])
  })
  it('should delete a product', async () => {
    await repo.delete(products[2]!.id)
    products.pop()
    const result = await repo.findAll()
    expect(result.length).toBe(2)
    expect(result).toEqual(products)
  })
  it('should round trip a product', async () => {
    const product = aProduct()
    products.push(product)
    await repo.save(product)
    expect(await repo.findById(product.id)).toEqual(product)
  })
  it(`should update a product's sku`, async () => {
    await repo.update(products[0]!.id, { sku: 'test-sku' })
    expect((await repo.findBySku('test-sku'))?.sku).toBe('test-sku')
  })
  it(`should update a product's name`, async () => {
    await repo.update(products[0]!.id, { name: 'test-name' })
    expect((await repo.findById(products[0]!.id))?.name).toBe('test-name')
  })
  it(`should update a product's price`, async () => {
    await repo.update(products[0]!.id, { price: 1 })
    expect((await repo.findById(products[0]!.id))?.price).toBe(1)
  })
  it(`should update a product's stock`, async () => {
    await repo.update(products[0]!.id, { stock: 1 })
    expect((await repo.findById(products[0]!.id))?.stock).toBe(1)
  })
})
