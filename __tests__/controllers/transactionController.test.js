/**
 * TDD Tests for Transaction Controller
 * Each test has a 10 second timeout
 *
 * Test Approach:
 * 1. Arrange - Setup test data and mocks
 * 2. Act - Execute the function being tested
 * 3. Assert - Verify expected outcomes
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const {
  checkConnection,
  cleanDatabase,
  setupTestData,
  getTestUser,
  closeTestDb,
} = require('../helpers/dbHelper');

// Import app (use real database for integration tests)
const app = require('../../src/app');

describe('Transaction Controller Tests (TDD)', () => {
  let authToken;
  let mockUser;

  beforeAll(async () => {
    // Check database connection first
    await checkConnection();

    // Clean database and setup test data
    await cleanDatabase();
    await setupTestData();

    // Get test user
    mockUser = getTestUser();

    // Generate valid JWT token
    authToken = jwt.sign(
      { email: mockUser.email, user_id: 1 },
      process.env.JWT_SECRET || 'nutech_test_secret_key_2026',
      { expiresIn: '1h' }
    );

    console.log('[INFO] Test setup completed');
  });

  afterAll(async () => {
    // Cleanup and close database connection
    await cleanDatabase();
    await closeTestDb();
  });

  afterEach(async () => {
    // Clean up test data after each test
    await cleanDatabase();
    await setupTestData();
  });

  /**
   * GET BALANCE TESTS
   * Test Suite: Get Balance Feature
   */
  describe('GET /balance - Get Balance Tests', () => {
    test(
      'should successfully get user balance with valid token',
      async () => {
        // Act
        const response = await request(app)
          .get('/balance')
          .set('Authorization', `Bearer ${authToken}`)
          .timeout(10000);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Get Balance Berhasil');
        expect(response.body.data.balance).toBeDefined();
        expect(typeof response.body.data.balance).toBe('number');
      },
      10000
    );

    test(
      'should return 404 when user not found',
      async () => {
        // Arrange - Create token for non-existent user
        const invalidToken = jwt.sign(
          { email: 'nonexistent@example.com', user_id: 999 },
          process.env.JWT_SECRET || 'nutech_test_secret_key_2026',
          { expiresIn: '1h' }
        );

        // Act
        const response = await request(app)
          .get('/balance')
          .set('Authorization', `Bearer ${invalidToken}`)
          .timeout(10000);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.status).toBe(101);
        expect(response.body.message).toBe('User tidak ditemukan');
      },
      10000
    );

    test(
      'should return 401 without authorization token',
      async () => {
        // Act
        const response = await request(app)
          .get('/balance')
          .timeout(10000);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(108);
        expect(response.body.message).toContain('Token');
      },
      10000
    );
  });

  /**
   * TOP UP TESTS
   * Test Suite: Top Up Feature
   */
  describe('POST /topup - Top Up Tests', () => {
    test(
      'should successfully top up balance with valid amount',
      async () => {
        // Arrange
        const topUpAmount = 100000;

        // Act
        const response = await request(app)
          .post('/topup')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ top_up_amount: topUpAmount })
          .timeout(10000);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Top Up Balance Berhasil');
        expect(response.body.data.balance).toBeDefined();
        expect(typeof response.body.data.balance).toBe('number');
        expect(response.body.data.balance).toBeGreaterThan(50000); // Initial balance is 50000
      },
      10000
    );

    test(
      'should reject top up with negative amount',
      async () => {
        // Act
        const response = await request(app)
          .post('/topup')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ top_up_amount: -5000 })
          .timeout(10000);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(102);
        expect(response.body.message).toContain('Parameter amount hanya boleh angka');
      },
      10000
    );

    test(
      'should reject top up with non-numeric amount',
      async () => {
        // Act
        const response = await request(app)
          .post('/topup')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ top_up_amount: 'invalid' })
          .timeout(10000);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(102);
        expect(response.body.message).toContain('Parameter amount hanya boleh angka');
      },
      10000
    );

    test(
      'should reject top up without amount field',
      async () => {
        // Act
        const response = await request(app)
          .post('/topup')
          .set('Authorization', `Bearer ${authToken}`)
          .send({})
          .timeout(10000);

        // Assert
        expect(response.status).toBe(400);
      },
      10000
    );
  });

  /**
   * TRANSACTION TESTS
   * Test Suite: Payment/Transaction Feature
   */
  describe('POST /transaction - Transaction Tests', () => {
    test(
      'should successfully create payment transaction',
      async () => {
        // Arrange
        const serviceCode = 'PAYMENT_1';

        // Act
        const response = await request(app)
          .post('/transaction')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ service_code: serviceCode })
          .timeout(10000);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Transaksi berhasil');
        expect(response.body.data.invoice_number).toBeDefined();
        expect(response.body.data.service_code).toBe(serviceCode);
        expect(response.body.data.transaction_type).toBe('PAYMENT');
        expect(response.body.data.total_amount).toBeDefined();
        expect(response.body.data.created_on).toBeDefined();
      },
      10000
    );

    test(
      'should reject transaction without service code',
      async () => {
        // Act
        const response = await request(app)
          .post('/transaction')
          .set('Authorization', `Bearer ${authToken}`)
          .send({})
          .timeout(10000);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(102);
        expect(response.body.message).toBe('Service code harus diisi');
      },
      10000
    );

    test(
      'should return error when service not found',
      async () => {
        // Arrange
        const serviceCode = 'INVALID_SERVICE';

        // Act
        const response = await request(app)
          .post('/transaction')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ service_code: serviceCode })
          .timeout(10000);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(102);
        expect(response.body.message).toBe('Service atau Layanan tidak ditemukan');
      },
      10000
    );

    test(
      'should return error when balance is insufficient',
      async () => {
        // Arrange
        const { testPool } = require('../helpers/dbHelper');
        const bcrypt = require('bcryptjs');

        // Create a user with low balance
        const poorUserEmail = 'poor@example.com';
        const hashedPassword = bcrypt.hashSync('password123', 10);

        await testPool.query(`
          INSERT INTO users (email, first_name, last_name, password, balance)
          VALUES ($1, 'Poor', 'User', $2, 1000)
          ON CONFLICT (email) DO UPDATE SET balance = 1000;
        `, [poorUserEmail, hashedPassword]);

        const poorUserToken = jwt.sign(
          { email: poorUserEmail, user_id: 999 },
          process.env.JWT_SECRET || 'nutech_test_secret_key_2026',
          { expiresIn: '1h' }
        );

        const serviceCode = 'PAYMENT_3'; // Expensive service (50000)

        // Act
        const response = await request(app)
          .post('/transaction')
          .set('Authorization', `Bearer ${poorUserToken}`)
          .send({ service_code: serviceCode })
          .timeout(10000);

        // Assert - Should get insufficient balance error
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(102);
        expect(response.body.message).toBe('Saldo tidak mencukupi');
      },
      10000
    );
  });

  /**
   * TRANSACTION HISTORY TESTS
   * Test Suite: Transaction History Feature
   */
  describe('GET /transaction/history - Transaction History Tests', () => {
    test(
      'should successfully get transaction history without limit',
      async () => {
        // Arrange - Create some transactions first
        await request(app)
          .post('/topup')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ top_up_amount: 100000 });

        await request(app)
          .post('/transaction')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ service_code: 'PAYMENT_1' });

        // Act
        const response = await request(app)
          .get('/transaction/history')
          .set('Authorization', `Bearer ${authToken}`)
          .timeout(10000);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(0);
        expect(response.body.message).toBe('Get History Berhasil');
        expect(response.body.data.offset).toBe(0);
        expect(response.body.data.records).toBeDefined();
        expect(Array.isArray(response.body.data.records)).toBe(true);
        expect(response.body.data.records.length).toBeGreaterThan(0);
      },
      10000
    );

    test(
      'should successfully get transaction history with limit',
      async () => {
        // Arrange
        const limit = 5;

        // Act
        const response = await request(app)
          .get(`/transaction/history?limit=${limit}`)
          .set('Authorization', `Bearer ${authToken}`)
          .timeout(10000);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.data.limit).toBe(limit);
        expect(response.body.data.records).toBeDefined();
      },
      10000
    );

    test(
      'should return empty array when no transactions found',
      async () => {
        // Arrange - Clean all transactions
        const { testPool } = require('../helpers/dbHelper');
        await testPool.query('DELETE FROM transactions;');

        // Act
        const response = await request(app)
          .get('/transaction/history')
          .set('Authorization', `Bearer ${authToken}`)
          .timeout(10000);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.data.records).toEqual([]);
        expect(response.body.data.limit).toBe(0);
      },
      10000
    );

    test(
      'should return 401 when getting history without token',
      async () => {
        // Act
        const response = await request(app)
          .get('/transaction/history')
          .timeout(10000);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(108);
      },
      10000
    );
  });

  /**
   * INTEGRATION TESTS
   * Test Suite: End-to-End Transaction Flow
   */
  describe('Integration Tests - Transaction Flow', () => {
    test(
      'should complete full transaction flow: get balance -> top up -> transaction -> get history',
      async () => {
        const serviceCode = 'PAYMENT_1';
        const topUpAmount = 100000;

        // Step 1: Get initial balance
        const balanceResponse1 = await request(app)
          .get('/balance')
          .set('Authorization', `Bearer ${authToken}`)
          .timeout(10000);

        expect(balanceResponse1.status).toBe(200);
        const initialBalance = balanceResponse1.body.data.balance;

        // Step 2: Top up
        const topUpResponse = await request(app)
          .post('/topup')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ top_up_amount: topUpAmount })
          .timeout(10000);

        expect(topUpResponse.status).toBe(200);
        expect(topUpResponse.body.data.balance).toBeGreaterThan(initialBalance);

        // Step 3: Create transaction
        const transactionResponse = await request(app)
          .post('/transaction')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ service_code: serviceCode })
          .timeout(10000);

        expect(transactionResponse.status).toBe(200);
        expect(transactionResponse.body.data.invoice_number).toBeDefined();

        // Step 4: Get history
        const historyResponse = await request(app)
          .get('/transaction/history')
          .set('Authorization', `Bearer ${authToken}`)
          .timeout(10000);

        expect(historyResponse.status).toBe(200);
        expect(historyResponse.body.data.records.length).toBeGreaterThan(0);

        // Verify balance after transaction
        const balanceResponse2 = await request(app)
          .get('/balance')
          .set('Authorization', `Bearer ${authToken}`)
          .timeout(10000);

        expect(balanceResponse2.status).toBe(200);
        expect(balanceResponse2.body.data.balance).toBeLessThan(topUpResponse.body.data.balance);
      },
      10000
    );
  });
});
