# Auth Specification

## Purpose

Authenticate users and protect routes via JWT tokens. A registered user receives a User identity and a linked Customer record.

## Requirements

### Requirement: RegisterUser

The system MUST create a User when provided with a unique email and a password of at least 8 characters.

#### Scenario: Successful registration

- GIVEN a valid email and password of at least 8 characters
- WHEN the user registers
- THEN a User is created, a Customer is created with the same email, a password hash is stored, and a JWT is returned

#### Scenario: Duplicate email

- GIVEN a User already exists with the provided email
- WHEN the user registers with that email
- THEN the system rejects the request with a 409 error

#### Scenario: Password too short

- GIVEN a password shorter than 8 characters
- WHEN the user registers
- THEN the system rejects the request with a 400 error

### Requirement: LoginUser

The system MUST issue a JWT when valid credentials are provided.

#### Scenario: Successful login

- GIVEN a registered User with a hashed password
- WHEN the user logs in with the correct email and password
- THEN the system returns a JWT containing userId and email

#### Scenario: Invalid credentials

- GIVEN a registered User
- WHEN the user provides an incorrect password or unknown email
- THEN the system returns a 401 error without distinguishing which field failed

### Requirement: JWTToken

The system MUST issue JWTs that include userId and email and expire after 24 hours.

#### Scenario: Token contents

- GIVEN a successful login
- WHEN the token is decoded
- THEN it contains userId and email and has an expiry of 24 hours

### Requirement: AuthMiddleware

The system MUST reject unauthenticated or invalid token requests and attach a valid token's payload to the request.

#### Scenario: Missing token

- GIVEN a protected endpoint
- WHEN a request is made without an Authorization header
- THEN the system returns a 401 error

#### Scenario: Invalid token

- GIVEN a protected endpoint
- WHEN a request contains a malformed or expired token
- THEN the system returns a 401 error

#### Scenario: Valid token

- GIVEN a protected endpoint
- WHEN a request contains a valid Bearer token
- THEN the system populates req.user with userId and email and proceeds

## Entity Rules

- User.email MUST be unique.
- User.passwordHash MUST be stored as a bcrypt hash, never plain text.
- User.passwordHash MUST be generated from a password with at least 8 characters.

## Use Case Contracts

| Use Case | Input | Output | Errors |
|----------|-------|--------|--------|
| RegisterUser | email, password | JWT token, userId | 409 Duplicate email, 400 Weak password |
| LoginUser | email, password | JWT token | 401 Invalid credentials |
| ValidateToken | raw JWT token | { userId, email } | 401 Invalid or expired token |
