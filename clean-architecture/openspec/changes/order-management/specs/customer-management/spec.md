# Customer Management Specification

## Purpose

Manage Customer profiles linked to User identities. Registration automatically creates a Customer; additional endpoints expose, update, and list Customers.

## Requirements

### Requirement: CustomerCreatedOnRegistration

The system MUST create a Customer record when a User registers successfully.

#### Scenario: Registration creates customer

- GIVEN a new registration payload
- WHEN RegisterUser succeeds
- THEN a Customer exists with userId, name, email, and optional phone matching the registration data

### Requirement: GetCustomer

The system MUST return a Customer by ID if it exists.

#### Scenario: Existing customer

- GIVEN a Customer with a known ID
- WHEN the endpoint requests that Customer
- THEN the system returns the Customer's id, userId, name, email, phone, and timestamps

#### Scenario: Customer not found

- GIVEN an unknown Customer ID
- WHEN the endpoint requests that Customer
- THEN the system returns a 404 error

### Requirement: UpdateCustomer

The system MUST partially update a Customer's name and phone fields.

#### Scenario: Update name and phone

- GIVEN an existing Customer
- WHEN the endpoint provides new name and phone values
- THEN the system persists the changes and returns the updated Customer

#### Scenario: Update customer not found

- GIVEN an unknown Customer ID
- WHEN the endpoint attempts to update
- THEN the system returns a 404 error

### Requirement: ListCustomers

The system MUST return all Customers.

#### Scenario: Customers exist

- GIVEN multiple Customers in the system
- WHEN the endpoint lists Customers
- THEN the system returns an array containing every Customer

#### Scenario: No customers

- GIVEN no Customers in the system
- WHEN the endpoint lists Customers
- THEN the system returns an empty array

## Entity Rules

- Customer.userId MUST reference an existing User.
- Customer.name MUST be non-empty.
- Customer.email MUST be a valid email format.
- Customer.phone MAY be optional.

## Use Case Contracts

| Use Case | Input | Output | Errors |
|----------|-------|--------|--------|
| CreateCustomer | userId, name, email, phone? | Customer | 400 Invalid data |
| GetCustomer | customerId | Customer | 404 Not found |
| UpdateCustomer | customerId, { name?, phone? } | Customer | 404 Not found, 400 Invalid data |
| ListCustomers | none | Customer[] | none |
