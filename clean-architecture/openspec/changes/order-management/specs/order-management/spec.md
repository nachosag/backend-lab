# Order Management Specification

## Purpose

Provide the order aggregate: customers create Orders, add items, submit them for processing, and transition them through a state machine until delivery or cancellation.

## Requirements

### Requirement: CreateOrder

The system MUST create an Order for a customer with at least one item.

#### Scenario: Create with valid items

- GIVEN a customerId and a list of items with valid productId and quantity greater than 0
- WHEN the endpoint creates an Order
- THEN the system returns an Order in DRAFT status with items, unit prices captured at creation time, and a computed total

#### Scenario: Empty item list

- GIVEN a customerId and no items
- WHEN the endpoint creates an Order
- THEN the system returns a 400 error

#### Scenario: Invalid quantity

- GIVEN an item with quantity of 0 or negative
- WHEN the endpoint creates an Order
- THEN the system returns a 400 error

#### Scenario: Product not found

- GIVEN an item referencing a non-existent productId
- WHEN the endpoint creates an Order
- THEN the system returns a 404 error

#### Scenario: Stock unavailable

- GIVEN an item with quantity exceeding the Product's available stock
- WHEN the endpoint creates an Order
- THEN the system returns a 409 error

### Requirement: AddItemToOrder

The system MUST allow items to be added only to Orders in DRAFT status.

#### Scenario: Add item to draft

- GIVEN an Order in DRAFT status
- WHEN the endpoint adds an item with productId and quantity
- THEN the system appends the item, recalculates the total, and returns the updated Order

#### Scenario: Add item to submitted order

- GIVEN an Order in PENDING status
- WHEN the endpoint attempts to add an item
- THEN the system returns a 409 error

#### Scenario: Stock unavailable

- GIVEN an Order in DRAFT status
- WHEN the endpoint adds an item whose quantity exceeds available stock
- THEN the system returns a 409 error

### Requirement: RemoveItemFromOrder

The system MUST allow items to be removed only from Orders in DRAFT status.

#### Scenario: Remove item from draft

- GIVEN an Order in DRAFT status with at least one item
- WHEN the endpoint removes an item by itemId
- THEN the system removes the item, recalculates the total, and returns the updated Order

#### Scenario: Remove item from submitted order

- GIVEN an Order in PENDING status
- WHEN the endpoint attempts to remove an item
- THEN the system returns a 409 error

#### Scenario: Item not found

- GIVEN an Order in DRAFT status
- WHEN the endpoint removes an unknown itemId
- THEN the system returns a 404 error

### Requirement: OrderStateMachine

The system MUST enforce valid Order status transitions.

#### Scenario: Valid transitions

- GIVEN an Order in DRAFT status
- WHEN submit is called
- THEN the Order transitions to PENDING

- GIVEN an Order in PENDING status with a COMPLETED payment
- WHEN confirm is called
- THEN the Order transitions to CONFIRMED

- GIVEN an Order in CONFIRMED status
- WHEN ship is called
- THEN the Order transitions to SHIPPED

- GIVEN an Order in SHIPPED status
- WHEN deliver is called
- THEN the Order transitions to DELIVERED

- GIVEN an Order in PENDING or CONFIRMED status
- WHEN cancel is called
- THEN the Order transitions to CANCELLED

#### Scenario: Invalid transitions

- GIVEN an Order in DRAFT status
- WHEN confirm is called
- THEN the system returns a 409 error

- GIVEN an Order in CANCELLED status
- WHEN submit is called
- THEN the system returns a 409 error

- GIVEN an Order in DELIVERED status
- WHEN cancel is called
- THEN the system returns a 409 error

### Requirement: OrderTotal

The system MUST compute the Order total as the sum of item subtotals where each subtotal equals quantity times unitPrice.

#### Scenario: Total calculation

- GIVEN an Order with two items of quantities 2 and 3 at unit prices 10 and 20
- WHEN the total is computed
- THEN the result equals 2*10 + 3*20 = 80

### Requirement: GetOrder

The system MUST return an Order by ID only to its owner.

#### Scenario: Owner retrieves order

- GIVEN an Order belonging to the authenticated user
- WHEN the endpoint requests the Order
- THEN the system returns the Order details

#### Scenario: Order not found

- GIVEN an unknown Order ID
- WHEN the endpoint requests the Order
- THEN the system returns a 404 error

#### Scenario: Non-owner retrieves order

- GIVEN an Order belonging to a different user
- WHEN the endpoint requests the Order
- THEN the system returns a 403 error

### Requirement: ListOrders

The system MUST return only Orders belonging to the authenticated user, optionally filtered by status and customerId.

#### Scenario: List own orders

- GIVEN two Orders belonging to the authenticated user and one belonging to another user
- WHEN the endpoint lists Orders
- THEN the system returns only the two Orders belonging to the authenticated user

#### Scenario: Filter by status

- GIVEN Orders in DRAFT and PENDING status for the authenticated user
- WHEN the endpoint lists Orders with status=DRAFT
- THEN the system returns only the DRAFT Orders

#### Scenario: Filter by customerId

- GIVEN Orders for two Customers belonging to the authenticated user
- WHEN the endpoint lists Orders with a specific customerId
- THEN the system returns only Orders for that customer

## Entity Rules

- Order MUST contain at least one OrderItem.
- Order.status MUST follow the state machine: DRAFT → PENDING → CONFIRMED → SHIPPED → DELIVERED, with cancellation allowed from PENDING or CONFIRMED to CANCELLED.
- OrderItem.quantity MUST be greater than 0.
- OrderItem.subtotal MUST equal quantity × unitPrice.
- Order.total MUST equal the sum of all OrderItem.subtotals.
- Order items MUST NOT be added or removed after the Order leaves DRAFT status.
- Order ownership MUST be enforced via the linked Customer's userId.

## Use Case Contracts

| Use Case | Input | Output | Errors |
|----------|-------|--------|--------|
| CreateOrder | customerId, items[] | Order (DRAFT) | 400 Invalid items, 404 Product not found, 409 Insufficient stock |
| AddItemToOrder | orderId, { productId, quantity } | Order | 404 Order not found, 409 Not DRAFT or insufficient stock |
| RemoveItemFromOrder | orderId, itemId | Order | 404 Order/item not found, 409 Not DRAFT |
| SubmitOrder | orderId | Order (PENDING) | 404 Not found, 409 Invalid transition |
| ConfirmOrder | orderId | Order (CONFIRMED) | 404 Not found, 409 Missing completed payment or invalid transition |
| ShipOrder | orderId | Order (SHIPPED) | 404 Not found, 409 Invalid transition |
| DeliverOrder | orderId | Order (DELIVERED) | 404 Not found, 409 Invalid transition |
| CancelOrder | orderId | Order (CANCELLED) | 404 Not found, 409 Invalid transition |
| GetOrder | orderId | Order | 404 Not found, 403 Forbidden |
| ListOrders | { status?, customerId? } | Order[] | 403 Forbidden when customerId belongs to another user |
