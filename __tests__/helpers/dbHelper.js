/**
 * Database Helper for Testing
 * Provides utilities for test database setup and cleanup
 */

const { Pool } = require('pg');

// Test database connection
const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
});

/**
 * Check database connection
 */
const checkConnection = async () => {
  try {
    const client = await testPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('[INFO] Database connection successful');
    return true;
  } catch (error) {
    console.error('[ERROR] Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Clean test database before/after tests
 */
const cleanDatabase = async () => {
  const client = await testPool.connect();
  try {
    // Clean tables in correct order (respect foreign keys)
    await client.query('DELETE FROM transactions WHERE invoice_number LIKE \'INV%\';');
    await client.query('DELETE FROM users WHERE email LIKE \'%test.example.com\';');
    await client.query('DELETE FROM services WHERE service_code LIKE \'PAYMENT_%\';');
    console.log('[INFO] Database cleaned successfully');
  } catch (error) {
    console.error('[ERROR] Error cleaning database:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Setup test data
 */
const setupTestData = async () => {
  const client = await testPool.connect();
  try {
    // Create test user with hashed password (bcrypt hash for 'password123')
    await client.query(`
      INSERT INTO users (email, first_name, last_name, password, balance)
      VALUES ('test@example.com', 'Test', 'User', '$2b$10$d40FZZduyTCW5YBMWwYbJ.17QJWgEv9TnwXlnCwqcNRnOr5WgCRse', 50000)
      ON CONFLICT (email) DO UPDATE SET balance = 50000;
    `);
    console.log('[INFO] Test user created/updated');

    // Create test services
    await client.query(`
      INSERT INTO services (service_code, service_name, service_tariff, service_icon)
      VALUES
        ('PAYMENT_1', 'Test Service 1', 5000, 'icon.png'),
        ('PAYMENT_2', 'Test Service 2', 10000, 'icon.png'),
        ('PAYMENT_3', 'Test Service 3', 50000, 'icon.png')
      ON CONFLICT (service_code) DO UPDATE SET
        service_name = EXCLUDED.service_name,
        service_tariff = EXCLUDED.service_tariff;
    `);
    console.log('[INFO] Test services created/updated');
  } catch (error) {
    console.error('[ERROR] Error setting up test data:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get test user data
 */
const getTestUser = () => ({
  email: 'test@example.com',
  password: 'password123',
  first_name: 'Test',
  last_name: 'User',
});

/**
 * Close test database connection
 */
const closeTestDb = async () => {
  await testPool.end();
};

module.exports = {
  testPool,
  checkConnection,
  cleanDatabase,
  setupTestData,
  getTestUser,
  closeTestDb,
};
