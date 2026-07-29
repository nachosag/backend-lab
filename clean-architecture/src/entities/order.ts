import { ConflictError, NotFoundError } from '../shared/errors.js'
import { generateId } from '../shared/ids.js'
import {
  createOrderItem,
  type CreateOrderItemInput,
  type OrderItem,
} from './order-item.js'
import { assertValidTransition, OrderStatus } from './order-status.js'

export interface Order {
  id: string
  customerId: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: Date
  updatedAt: Date
  addItem(item: CreateOrderItemInput): Order
  removeItem(itemId: string): Order
  submit(): Order
  confirm(): Order
  ship(): Order
  deliver(): Order
  cancel(): Order
}

export function createOrder(input: { customerId: string }): Order {
  const currentDate = new Date()

  return {
    id: generateId(),
    customerId: input.customerId,
    status: OrderStatus.DRAFT,
    items: [],
    total: 0,
    createdAt: currentDate,
    updatedAt: currentDate,
    addItem(item: CreateOrderItemInput): Order {
      assertValidTransition(this.status, OrderStatus.DRAFT)

      const orderItem = createOrderItem(item)

      return {
        ...this,
        items: [...this.items, orderItem],
        total: this.total + orderItem.subtotal,
      }
    },
    removeItem(itemId: string): Order {
      assertValidTransition(this.status, OrderStatus.DRAFT)

      const orderItem = this.items.find((item) => item.id === itemId)

      if (!orderItem)
        throw new NotFoundError(`Item with id: ${itemId} was not found`)

      return {
        ...this,
        items: this.items.filter((item) => item.id !== orderItem.id),
        total: this.total - orderItem.subtotal,
      }
    },
    submit(): Order {
      assertValidTransition(this.status, OrderStatus.PENDING)

      if (this.items.length === 0)
        throw new ConflictError('Cannot submit an order with no items')

      return {
        ...this,
        status: OrderStatus.PENDING,
      }
    },
    confirm(): Order {
      assertValidTransition(this.status, OrderStatus.CONFIRMED)

      return {
        ...this,
        status: OrderStatus.CONFIRMED,
      }
    },
    ship(): Order {
      assertValidTransition(this.status, OrderStatus.SHIPPED)

      return {
        ...this,
        status: OrderStatus.SHIPPED,
      }
    },
    deliver(): Order {
      assertValidTransition(this.status, OrderStatus.DELIVERED)

      return {
        ...this,
        status: OrderStatus.DELIVERED,
      }
    },
    cancel(): Order {
      assertValidTransition(this.status, OrderStatus.CANCELLED)

      return {
        ...this,
        status: OrderStatus.CANCELLED,
      }
    },
  }
}
