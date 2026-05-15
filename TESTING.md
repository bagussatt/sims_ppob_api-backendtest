# Testing Documentation

## Overview
This project uses Jest and Supertest for TDD (Test-Driven Development) testing with real database integration. Each test request has a timeout of 10 seconds.

## Test Configuration
- **Testing Framework**: Jest
- **API Testing**: Supertest
- **Database**: Real PostgreSQL integration tests
- **Timeout**: 10 seconds per test
- **Environment**: Test environment configured in `.env.test`

## Prerequisites

### Database Setup
Before running tests, ensure you have:
1. PostgreSQL database running
2. Test database created (separate from production)
3. `.env.test` file configured with test database credentials

### Environment Files
- `.env` - Production environment variables
- `.env.test` - Test environment variables
- `.env.example` - Template for environment variables

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

### Directory Structure
```
__tests__/
├── controllers/
│   └── transactionController.test.js
└── helpers/
    └── dbHelper.js
```

### Database Helper
The `dbHelper.js` provides utilities for test database management:
- `cleanDatabase()` - Clean test data before/after tests
- `setupTestData()` - Setup test users and services
- `getTestUser()` - Get test user credentials
- `closeTestDb()` - Close database connection after tests

### Test Categories

#### 1. **GET /balance - Get Balance Tests**
- ✅ Successfully get user balance with valid token
- ✅ Return 404 when user not found
- ✅ Return 401 without authorization token

#### 2. **POST /topup - Top Up Tests**
- ✅ Successfully top up balance with valid amount
- ✅ Reject top up with negative amount
- ✅ Reject top up with non-numeric amount
- ✅ Reject top up without amount field

#### 3. **POST /transaction - Transaction Tests**
- ✅ Successfully create payment transaction
- ✅ Reject transaction without service code
- ✅ Return error when service not found
- ✅ Return error when balance is insufficient

#### 4. **GET /transaction/history - Transaction History Tests**
- ✅ Successfully get transaction history without limit
- ✅ Successfully get transaction history with limit
- ✅ Return empty array when no transactions found
- ✅ Return 401 when getting history without token

#### 5. **Integration Tests - Transaction Flow**
- ✅ Complete full transaction flow (get balance → top up → transaction → get history)

## TDD Approach

Each test follows the **Arrange-Act-Assert** pattern:

```javascript
test('should test something', async () => {
  // Arrange - Setup test data
  const testData = { ... };

  // Act - Execute the function being tested
  const response = await request(app)
    .post('/endpoint')
    .send(testData);

  // Assert - Verify expected outcomes
  expect(response.status).toBe(200);
  expect(response.body.data).toBeDefined();
}, 10000); // 10 second timeout
```

## Integration vs Unit Tests

### Integration Tests (Current Implementation)
- **Database**: Real PostgreSQL connection
- **Environment**: Uses `.env.test` configuration
- **Auth**: Real JWT token generation and validation
- **Advantages**: Tests complete application flow
- **Use Cases**: End-to-end API testing, transaction flows

### Test Lifecycle
1. `beforeAll()` - Setup test database and user
2. `afterEach()` - Clean and reset test data
3. `afterAll()` - Final cleanup and close database connections

## Mock Configuration

### Database Mocks
- PostgreSQL connection is mocked
- `transactionModel` methods are mocked for isolated testing

### Authentication Mocks
- JWT tokens are generated for testing
- Valid and invalid token scenarios are tested

## Timeout Configuration

Each test has a **10 second timeout** to prevent hanging tests:

```javascript
test('test description', async () => {
  // test code
}, 10000); // 10 seconds = 10000 milliseconds
```

## Best Practices

1. **Always use timeouts**: Each test should have a 10 second timeout
2. **Clean up mocks**: Use `afterEach()` to clear mocks between tests
3. **Test both success and failure cases**: Ensure comprehensive coverage
4. **Use descriptive test names**: Test names should clearly describe what is being tested
5. **Follow TDD principles**: Write tests first, then implement code

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
psql -h host -U username -d database

# Verify .env.test configuration
cat .env.test

# Test database connection
node -e "console.log(require('pg').Pool)"
```

### Tests timeout after 10 seconds
- Check if test database is accessible
- Verify DATABASE_URL in `.env.test` is correct
- Ensure network connectivity to database server
- Check database server performance

### Test data conflicts
- `afterEach()` hook cleans data between tests
- `beforeAll()` setup fresh test data
- Verify `dbHelper.js` is working correctly

### Authentication failures
- Ensure JWT_SECRET is set in `.env.test`
- Verify token generation uses correct secret
- Check token format in Authorization header
- Token should be: `Bearer <token>`

### Missing test database
```sql
-- Create test database
CREATE DATABASE nutech_test;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE nutech_test TO postgres;
```

## Next Steps

To add more tests:

1. Create new test file in `__tests__/` directory
2. Follow the TDD pattern (Arrange-Act-Assert)
3. Set 10 second timeout for each test
4. Mock all external dependencies
5. Run tests with `npm test`
