# Inventory Specification

## Purpose

Protect product stock by validating availability during order creation, deducting stock on confirmation, and restoring stock on cancellation or refund.

## Requirements

### Requirement: CheckStock

The system MUST validate that each requested item quantity does not exceed the Product's available stock.

#### Scenario: Sufficient stock

- GIVEN a Product with stock 10 and a request for quantity 5
- WHEN stock is checked
- THEN the system allows the request

#### Scenario: Insufficient stock

- GIVEN a Product with stock 3 and a request for quantity 5
- WHEN stock is checked
- THEN the system rejects the request with a 409 error

#### Scenario: Exact stock

- GIVEN a Product with stock 5 and a request for quantity 5
- WHEN stock is checked
- THEN the system allows the request

### Requirement: DeductStock

The system MUST reduce product stock by the ordered quantities when an Order is confirmed.

#### Scenario: Deduct on confirm

- GIVEN an Order in PENDING status with items totaling 5 units of Product A and 3 units of Product B
- WHEN the Order is confirmed
- THEN Product A stock decreases by 5 and Product B stock decreases by 3

#### Scenario: Confirm reduces stock to zero

- GIVEN an Order requiring exactly the available stock of a Product
- WHEN the Order is confirmed
- THEN the Product stock becomes 0

### Requirement: RestoreStock

The system MUST restore product stock when an Order is cancelled after confirmation or when a Payment is refunded.

#### Scenario: Restore on cancel after confirmation

- GIVEN a CONFIRMED Order whose confirmation deducted 5 units of Product A
- WHEN the Order is cancelled
- THEN Product A stock increases by 5

#### Scenario: Restore on refund

- GIVEN a CONFIRMED Order with a COMPLETED Payment that deducted 5 units of Product A
- WHEN the Payment is refunded
- THEN Product A stock increases by 5

#### Scenario: Cancel before confirmation does not restore stock

- GIVEN a PENDING Order that has not yet deducted stock
- WHEN the Order is cancelled
- THEN Product stock remains unchanged

### Requirement: StockNeverNegative

The system MUST ensure product stock never falls below 0.

#### Scenario: Concurrent deductions

- GIVEN a Product with stock 5 and two Orders attempting to confirm 3 units each
- WHEN both confirmations are processed
- THEN the first succeeds and the second fails with a 409 error

#### Scenario: Stock at zero

- GIVEN a Product with stock 0
- WHEN an Order attempts to confirm an item for that Product
- THEN the system rejects the confirmation with a 409 error

## Entity Rules

- Product.stock MUST be greater than or equal to 0 at all times.
- DeductStock MUST reduce Product.stock by the ordered quantity only when sufficient stock exists.
- RestoreStock MUST increase Product.stock by the previously deducted quantity.
- Stock MUST be checked during CreateOrder and AddItemToOrder.
- Stock MUST be deducted during ConfirmOrder.
- Stock MUST be restored during CancelOrder when the Order was previously CONFIRMED, and during RefundPayment.

## Use Case Contracts

| Use Case | Input | Output | Errors |
|----------|-------|--------|--------|
| CheckStock | items[] | boolean | 409 Insufficient stock |
| DeductStock | orderId | void | 409 Insufficient stock |
| RestoreStock | orderId | void | 404 Order not found |
| ValidateStockForOrder | orderId | void | 409 Insufficient stock for any item |
