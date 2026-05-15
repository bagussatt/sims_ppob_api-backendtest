# Nutech Integrasi Backend Test

Backend service untuk integrasi Nutech dengan menggunakan Express.js, PostgreSQL, dan JWT authentication.

## Project Structure

```
nutech-integrasi-backend-test/
├── src/                          # Source code directory
│   ├── config/                   # Configuration files
│   │   ├── db.js                # Database connection configuration
│   │   └── swagger.js           # Swagger documentation setup
│   │
│   ├── controllers/              # Request handlers and business logic
│   │   ├── authController.js    # Authentication (login, register, profile)
│   │   ├── bannerController.js  # Banner management
│   │   ├── serviceController.js # Service management
│   │   └── transactionController.js # Transaction management
│   │
│   ├── middlewares/              # Custom middleware functions
│   │   ├── authMiddleware.js    # JWT authentication verification
│   │   ├── errorMiddleware.js   # Global error handling
│   │   ├── uploadMiddleware.js  # File upload handling
│   │   └── validator.js         # Input validation
│   │
│   ├── models/                   # Database models and queries
│   │   ├── userModel.js         # User-related database operations
│   │   ├── bannerModel.js       # Banner-related database operations
│   │   ├── serviceModel.js      # Service-related database operations
│   │   └── transactionModel.js  # Transaction-related database operations
│   │
│   ├── routes/                   # API route definitions
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── bannerRoutes.js      # Banner endpoints
│   │   ├── serviceRoutes.js     # Service endpoints
│   │   ├── transactionRoutes.js # Transaction endpoints
│   │   └── index.js             # Route consolidation
│   │
│   ├── utils/                    # Utility functions
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   ├── errorResponse.js     # Custom error class
│   │   └── responseFormatter.js # Standard response formatter
│   │
│   └── app.js                    # Express application setup
│
├── __tests__/                    # Test files
│   ├── controllers/              # Controller tests
│   │   └── transactionController.test.js
│   └── helpers/                  # Test utilities
│       └── dbHelper.js          # Database test helper
│
├── uploads/                      # File upload storage
├── .env                          # Environment variables
├── .env.test                     # Test environment variables
├── package.json                  # Project dependencies and scripts
├── jest.setup.js                 # Jest test configuration
└── TESTING.md                    # Testing documentation

## Prerequisites

- Node.js
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## API Documentation

Once the server is running, access Swagger documentation at:
```
http://localhost:3000/api-docs
```

## Directory Explanation

### src/config/
Configuration files for database connection and API documentation setup.

### src/controllers/
Request handlers that contain business logic for each feature. Controllers receive HTTP requests, validate data, interact with models, and return responses.

### src/middlewares/
Custom middleware functions that handle cross-cutting concerns like authentication, error handling, file uploads, and validation.

### src/models/
Database interaction layer. Models contain SQL queries and database operations for each entity (users, banners, services, transactions).

### src/routes/
API endpoint definitions. Routes map HTTP endpoints to controller functions and apply middleware as needed.

### src/utils/
Reusable utility functions used across the application, including error handling wrappers and response formatters.

### src/app.js
Main Express application setup. Configures middleware, routes, error handling, and starts the server.

## Features

- User authentication (registration, login, profile management)
- JWT-based authentication with 12-hour expiration
- Banner management system
- Service catalog with tariff information
- Transaction system (top-up, payments, history)
- File upload capability for profile images
- Comprehensive test suite with 10-second timeout per request
- Swagger API documentation


## Environment Variables

- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Environment mode (development/production/test)
