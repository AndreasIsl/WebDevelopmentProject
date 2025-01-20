-- Create Database
CREATE DATABASE mochtehaben_db;

-- Connect to database
\c mochtehaben_db

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    company_name VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real Estate Listings Table
CREATE TABLE real_estate_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL,  -- (wohnung, haus, etc.)
    listing_type VARCHAR(50) NOT NULL,   -- (mieten, kaufen)
    price DECIMAL NOT NULL,
    living_area DECIMAL NOT NULL,
    land_area DECIMAL,
    rooms INTEGER,
    building_type VARCHAR(50),           -- (altbau, neubau)
    condition VARCHAR(50),               -- (neu, renoviert, gebraucht)
    address_street VARCHAR(255),
    address_city VARCHAR(100) NOT NULL,
    address_state VARCHAR(100) NOT NULL,
    address_zip VARCHAR(10) NOT NULL,
    available_from DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real Estate Features Table
CREATE TABLE real_estate_features (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES real_estate_listings(id),
    feature_type VARCHAR(50) NOT NULL,   -- (ausstattung, freiflachen, heizung)
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(255),          -- For additional data like m² for balcony
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real Estate Images Table
CREATE TABLE real_estate_images (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES real_estate_listings(id),
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy Certificate Table
CREATE TABLE energy_certificates (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES real_estate_listings(id),
    hwb VARCHAR(50),
    hwb_class VARCHAR(10),
    fgee VARCHAR(50),
    fgee_class VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Additional Costs Table
CREATE TABLE additional_costs (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES real_estate_listings(id),
    cost_type VARCHAR(50) NOT NULL,      -- (provision, ablose, etc.)
    amount DECIMAL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);