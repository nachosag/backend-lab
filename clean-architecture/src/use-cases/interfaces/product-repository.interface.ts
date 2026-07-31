import type { Product } from '../../entities/product.js'

export interface ProductRepository {
  findById(id: string): Promise<Product | null>
  findBySku(sku: string): Promise<Product | null>
  findAll(): Promise<Product[]>
  save(product: Product): Promise<Product>
  update(
    id: string,
    patch: Partial<Pick<Product, 'sku' | 'name' | 'price' | 'stock'>>,
  ): Promise<Product>
  delete(id: string): Promise<void>
}
