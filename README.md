# Basic Authentication with Token and RefreshToken Structure

## Technologies:
- Node.js
- PostgreSQL
- TypeScript
- Express.js
- Redis

## Authentication Flow:
1. **Login Endpoint (`/login`)**:
    - The user will authenticate using their email and password.
    - If credentials are correct, a **JWT token** and a **refresh token** will be returned.
    - The JWT token will be used for authenticating access to protected routes.

2. **Protected Routes**:
    - `/dashboard`: This endpoint will be protected by the JWT token.
        - Only authenticated users with a valid JWT token can access it.
        - On successful access, the user’s email will be displayed.

3. **Session Control**:
    - Sessions will be managed dynamically using Redis to store the JWT token and refresh token.

4. **User Registration**:
    - `/getUsers`: This endpoint will return the list of users registered in the last two months.

---


# Authentication System with Node.js, PostgreSQL, Redis, and JWT

This project implements a basic authentication system using Node.js, TypeScript, PostgreSQL, Redis, and Express.js. It supports JWT tokens for authentication, with functionality to issue access tokens and refresh tokens.

## Prerequisites

- **Docker** (for running PostgreSQL and Redis)
- **Node.js** (v22 or later)
- **TypeScript**
- **`ts-node`** (for running TypeScript code directly)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run PostgreSQL and Redis Containers Manually Using Docker
#### 2.1. Run PostgreSQL Container

```bash
docker run -d \
  --name postgres-container \
  -e POSTGRES_USER=docker_user \
  -e POSTGRES_PASSWORD=docker_user \
  -e POSTGRES_DB=authdb \
  -p 5432:5432 \
  postgres:latest
```

#### 2.2. Run Redis Container

```bash
docker run -d \
  --name redis-container \
  -p 6379:6379 \
  redis:latest
```

### 3. Run the TypeScript Application with ts-node

```bash
docker run -d \
  --name redis-container \
  -p 6379:6379 \
  redis:latest
```

### 4. Run userSeed and run app
```bash
  npm run userSeed
  npx run dev
```

### 5. Access the Application

- The application will be accessible at http://localhost:3000/api/docs swagger.
- Test the /dashboard endpoint by sending a request with a valid JWT token in the Authorization header.