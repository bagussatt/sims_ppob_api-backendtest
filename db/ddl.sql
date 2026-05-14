CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    balance DECIMAL(15, 2) DEFAULT 0 NOT NULL 
);

CREATE TABLE banners (
    banner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    banner_name VARCHAR(100) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE services (
    service_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tariff DECIMAL(15, 2) NOT NULL
);

CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, 
    description VARCHAR(255),
    total_amount DECIMAL(15, 2) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);