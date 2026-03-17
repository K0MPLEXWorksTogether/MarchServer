# March Server

Backend API for the March productivity/focus platform.  
This service manages users, authentication, goals, tasks, sessions, analytics, and related domain data on MongoDB.

## What this project does

- Provides a TypeScript + Express API runtime on Bun
- Connects to MongoDB via Mongoose models
- Implements authentication flow:
  - `signup` (client sends pre-hashed password)
  - `verify` email with token
  - `login` with argon2 hash verification
  - `refresh` token from cookie
- Sends verification emails with template-based Nodemailer utility
- Uses JWT access/refresh cookies for auth sessions

## Core features

### 1) Auth flow with verification

- Signup stores user as unverified and sends a verification email.
- Verification endpoint validates `userId + token`, marks user verified, and issues auth cookies.
- Login validates credentials and verified status before issuing tokens.
- Refresh rotates both access and refresh tokens using `refreshToken` cookie.

### 2) Strong validation and clear errors

- Zod-based request validation in controllers
- Structured validation error response:
  - `message`
  - `errors[]` (`path`, `code`, `message`)
- Domain errors are returned explicitly (no silent failures)

### 3) Repository-driven architecture

- Controllers orchestrate flow (validate -> call repo -> respond)
- Repository classes encapsulate persistence logic
- DTO parsing through Zod keeps outputs consistent and typed

### 4) Request trace logging end-to-end

- Request middleware logs:
  - request arrival
  - request completion (status + duration)
- Controller logs:
  - method hit
  - repo call start/success
  - response sent / handled error
- Repository logs:
  - success paths
  - known failure paths

This gives a complete operational trail per request.

## High-level architecture

- `src/index.ts`: app bootstrap, middleware, router mounting, health endpoint
- `src/routes/*`: route definitions
- `src/controllers/*`: request handling + validation + orchestration
- `src/repository/*`: database operations + duplicate checks + DTO mapping
- `src/models/*`: Mongoose schemas/models
- `src/schema/*`: Zod DTOs and payload schemas
- `src/utils/*`: DB connection, JWT, logger, mailer, mail templates
- `src/spec/*`: OpenAPI specs (auth currently documented)

## Tech stack

- Runtime/tooling: Bun, TypeScript
- HTTP: Express
- DB: MongoDB + Mongoose
- Validation: Zod
- Auth: JWT + argon2 verify
- Mail: Nodemailer
- Logging: Pino (`pino-pretty`)

## Setup

### 1) Install dependencies

```bash
bun install
```

### 2) Configure environment

Create env file values (based on `src/.env.example`):

```env
JWT_SECRET=...
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=30m

MONGODB_URL=mongodb://localhost:27017/march

MAIL_SERVICE=gmail
MAIL_USERNAME=example@gmail.com
MAIL_PASSKEY=app-password

PORT=3000
NODE_ENV=development
```

### 3) Run server

```bash
bun run dev
```

Health check:

```bash
curl -i http://localhost:3000/health
```

## Auth API quickstart

### Signup

```bash
curl -i -X POST "http://localhost:3000/api/v1/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"janedoe01",
    "email":"jane@example.com",
    "passwordHash":"$argon2id$v=19$m=65536,t=3,p=4$...$...",
    "timezone":"Asia/Kolkata",
    "locale":"en-IN"
  }'
```

### Verify

```bash
curl -i "http://localhost:3000/api/v1/auth/verify?userId=<userId>&token=<uuid-token>"
```

### Login

```bash
curl -i -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"StrongPass!123"}'
```

### Refresh (cookie-based)

```bash
curl -i -X POST "http://localhost:3000/api/v1/auth/refresh" \
  --cookie "refreshToken=<refresh_token>"
```
