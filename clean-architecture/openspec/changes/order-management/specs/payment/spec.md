# Payment Specification

## Purpose

Record payments against Orders, validate payment amounts, and enforce a payment status lifecycle that gates order confirmation.

## Requirements

### Requirement: CreatePayment

The system MUST create a single Payment for an Order whose amount equals the Order total.

#### Scenario: Payment matches total

- GIVEN an Order with total 100
- WHEN the endpoint creates a Payment of amount 100
- THEN the system returns a Payment with status PENDING

#### Scenario: Payment amount mismatch

- GIVEN an Order with total 100
- WHEN the endpoint creates a Payment of amount 90
- THEN the system returns a 400 error

#### Scenario: Duplicate payment

- GIVEN an Order that already has a Payment
- WHEN the endpoint creates another Payment
- THEN the system returns a 409 error

#### Scenario: Order not found

- GIVEN an unknown Order ID
- WHEN the endpoint creates a Payment
- THEN the system returns a 404 error

### Requirement: PaymentStateMachine

The system MUST enforce the Payment status lifecycle: PENDING → COMPLETED or FAILED, and COMPLETED → REFUNDED.

#### Scenario: Complete payment

- GIVEN a Payment in PENDING status
- WHEN the endpoint marks it as COMPLETED
- THEN the system returns the updated Payment

#### Scenario: Fail payment

- GIVEN a Payment in PENDING status
- WHEN the endpoint marks it as FAILED
- THEN the system returns the updated Payment

#### Scenario: Refund payment

- GIVEN a Payment in COMPLETED status
- WHEN the endpoint marks it as REFUNDED
- THEN the system returns the updated Payment

#### Scenario: Invalid transition

- GIVEN a Payment in FAILED status
- WHEN the endpoint attempts to mark it as COMPLETED
- THEN the system returns a 409 error

### Requirement: PaymentGatesConfirmation

The system MUST allow an Order to be confirmed only when its Payment is COMPLETED.

#### Scenario: Confirm with completed payment

- GIVEN an Order in PENDING status with a COMPLETED Payment
- WHEN confirm is called
- THEN the Order transitions to CONFIRMED

#### Scenario: Confirm without completed payment

- GIVEN an Order in PENDING status with a PENDING or FAILED Payment
- WHEN confirm is called
- THEN the system returns a 409 error

### Requirement: RefundTriggersCancellation

The system MUST cancel an Order when its Payment is refunded and restore inventory.

#### Scenario: Refund cancels confirmed order

- GIVEN an Order in CONFIRMED status with a COMPLETED Payment
- WHEN the Payment is refunded
- THEN the Order transitions to CANCELLED, inventory is restored, and the Payment becomes REFUNDED

#### Scenario: Refund already cancelled order

- GIVEN an Order already in CANCELLED status
- WHEN the Payment is refunded
- THEN the Payment becomes REFUNDED but the Order remains CANCELLED

## Entity Rules

- Payment.orderId MUST reference an existing Order.
- Payment.amount MUST equal the linked Order's total at the time of creation.
- Payment.status MUST follow the state machine: PENDING → COMPLETED, PENDING → FAILED, COMPLETED → REFUNDED.
- An Order MUST have at most one Payment.
- Only a COMPLETED Payment permits the Order to transition to CONFIRMED.

## Use Case Contracts

| Use Case | Input | Output | Errors |
|----------|-------|--------|--------|
| CreatePayment | orderId, amount, method | Payment (PENDING) | 404 Order not found, 400 Amount mismatch, 409 Payment already exists |
| ProcessPayment | paymentId | Payment (COMPLETED) | 404 Not found, 409 Invalid transition |
| FailPayment | paymentId | Payment (FAILED) | 404 Not found, 409 Invalid transition |
| RefundPayment | paymentId | Payment (REFUNDED), Order (CANCELLED) | 404 Not found, 409 Invalid transition |
| GetPayment | orderId | Payment | 404 Order or payment not found |
