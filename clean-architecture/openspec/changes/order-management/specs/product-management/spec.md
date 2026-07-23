# Product Management Specification

## Purpose

Manage the product catalog. Products are publicly viewable, but creation, modification, and deletion require authentication.

## Requirements

### Requirement: CreateProduct

The system MUST create a Product with a unique SKU, a positive price, and a non-negative stock.

#### Scenario: Successful creation

- GIVEN a unique SKU, name, price greater than 0, and stock of 0 or more
- WHEN the endpoint creates a Product
- THEN the system returns the Product with id, sku, name, price, and stock

#### Scenario: Duplicate SKU

- GIVEN an existing Product with SKU "ABC-123"
- WHEN the endpoint creates another Product with the same SKU
- THEN the system returns a 409 error

#### Scenario: Invalid price or stock

- GIVEN a price of 0 or negative, or stock below 0
- WHEN the endpoint creates a Product
- THEN the system returns a 400 error

### Requirement: GetProduct

The system MUST return a Product by ID without authentication.

#### Scenario: Existing product

- GIVEN a Product with a known ID
- WHEN any client requests that Product
- THEN the system returns the Product details

#### Scenario: Product not found

- GIVEN an unknown Product ID
- WHEN the endpoint requests that Product
- THEN the system returns a 404 error

### Requirement: UpdateProduct

The system MUST partially update a Product and enforce SKU uniqueness.

#### Scenario: Partial update

- GIVEN an existing Product
- WHEN the endpoint provides new name, price, and stock values
- THEN the system persists the changes and returns the updated Product

#### Scenario: SKU conflict on update

- GIVEN two Products with different SKUs
- WHEN the endpoint changes one SKU to match the other
- THEN the system returns a 409 error

#### Scenario: Update product not found

- GIVEN an unknown Product ID
- WHEN the endpoint attempts to update
- THEN the system returns a 404 error

### Requirement: ListProducts

The system MUST return all Products without authentication.

#### Scenario: Products exist

- GIVEN multiple Products
- WHEN any client lists Products
- THEN the system returns an array containing every Product

#### Scenario: No products

- GIVEN no Products
- WHEN any client lists Products
- THEN the system returns an empty array

### Requirement: DeleteProduct

The system MUST remove a Product by ID if it is not referenced by any existing OrderItem.

#### Scenario: Delete unused product

- GIVEN a Product that is not referenced by any OrderItem
- WHEN the endpoint deletes it
- THEN the system removes the Product and returns a 204 response

#### Scenario: Delete referenced product

- GIVEN a Product referenced by at least one OrderItem
- WHEN the endpoint deletes it
- THEN the system returns a 409 error

#### Scenario: Delete product not found

- GIVEN an unknown Product ID
- WHEN the endpoint deletes it
- THEN the system returns a 404 error

## Entity Rules

- Product.sku MUST be unique across the catalog.
- Product.price MUST be strictly greater than 0.
- Product.stock MUST be greater than or equal to 0.
- Product.stock MUST NOT be deleted while referenced by an OrderItem.

## Use Case Contracts

| Use Case | Input | Output | Errors |
|----------|-------|--------|--------|
| CreateProduct | sku, name, price, stock | Product | 400 Invalid data, 409 Duplicate SKU |
| GetProduct | productId | Product | 404 Not found |
| UpdateProduct | productId, { sku?, name?, price?, stock? } | Product | 400 Invalid data, 404 Not found, 409 Duplicate SKU |
| ListProducts | none | Product[] | none |
| DeleteProduct | productId | void | 404 Not found, 409 Referenced by order |
