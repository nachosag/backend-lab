import type { Product } from '../../../entities/product.js'
import { NotFoundError } from '../../../shared/errors.js'
import type { ProductRepository } from '../../../use-cases/interfaces/product-repository.interface.js'

export class InMemoryProductRepository implements ProductRepository {
  private store = new Map<string, Product>()

  async findAll(): Promise<Product[]> {
    return this.store.values().toArray()
  }

  async findById(id: string): Promise<Product | null> {
    return this.store.get(id) ?? null
  }

  async findBySku(sku: string): Promise<Product | null> {
    for (const product of this.store.values()) {
      if (product.sku === sku) return product
    }

    return null
  }

  async save(product: Product): Promise<Product> {
    this.store.set(product.id, product)

    return product
  }

  async update(
    id: string,
    patch: Partial<Pick<Product, 'sku' | 'name' | 'price' | 'stock'>>,
  ): Promise<Product> {
    const product = await this.findById(id)

    if (!product) throw new NotFoundError('Product not found')

    Object.assign(product, patch)

    this.store.set(id, product)

    return product
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id)
  }
}
