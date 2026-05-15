// Test setup file
// This file runs before all tests

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

// Override test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3001';

// Increase timeout for database operations
jest.setTimeout(10000);

// Setup global test utilities
global.testTimeout = 10000; // 10 seconds per request

