<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/lucide:server.svg?color=%23ffffff">
  <img src="https://api.iconify.design/lucide:server.svg?color=%23000000" width="40" height="40" alt="" />
</picture>

# Zyloo API

The backend API powering Zyloo, a modern e-commerce platform. It provides authentication, product management, cart and order management, payment processing, image uploads, and role-based access control.

![Node.js](https://img.shields.io/badge/Node.js-000000?style=flat-square&logo=node.js&logoColor=339933)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=flat-square&logo=javaScript&logoColor=F7DF1E)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000000?style=flat-square&logo=postgresql&logoColor=4169E1)
![Prisma](https://img.shields.io/badge/Prisma-000000?style=flat-square&logo=prisma&logoColor=white)

</div>

---

## Core Features

- User authentication with JWT
- Role-based authorization for customers and admins
- Product and category management
- Cart and cart item management
- Order creation and management
- Paystack payment integration
- Cloudinary image uploads
- PostgreSQL database with Prisma ORM
- RESTful API architecture

## Tech Stack

Node.js · Express.js · JavaScript · PostgreSQL · Prisma ORM · JWT · Cloudinary · Multer · Paystack

## Project Structure

```text
server/
├── controllers/
├── routes/
├── middleware/
├── services/
├── prisma/
└── ...
```

The backend follows a modular structure that separates API routes, business logic, middleware, and database operations.

## Authentication

Zyloo uses JWT-based authentication with HTTP-only cookies.

The API supports:

- Registration
- Login
- Logout
- Current user validation
- Protected routes
- Role-based access control

Roles include:

```text
CUSTOMER
ADMIN
```

## API

The API provides endpoints for resources including:

```text
Users
Products
Categories
Cart
Orders
Payments
```

**Production API:** *Add production API link here*

## Database

Zyloo uses PostgreSQL with Prisma ORM for database management and type-safe queries.

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd zyloo
```

Install dependencies:

```bash
pnpm install
```

Create a `.env` file and configure the required environment variables:

```env
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
PAYSTACK_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Start the development server:

```bash
pnpm dev
```

The API will run locally on:

```text
http://localhost:8000
```

## Deployment

The Zyloo API is deployed using Render.

*Add deployment information here*

## Author

**Cyril** — Software & Web Developer
GitHub: [@cyril9t](https://github.com/cyril9t)