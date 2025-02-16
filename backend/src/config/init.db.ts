import { Pool } from 'pg';
import pool from './db.config';


export async function createTables() {
  try {
    // First create the database if it doesn't exist
    await pool.query(`
      SELECT 'CREATE DATABASE realestate'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'realestate')
    `).catch(() => {
      console.log('Database might already exist, continuing...');
    });

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        listing_type VARCHAR(50) NOT NULL,
        price NUMERIC NOT NULL,
        location JSONB NOT NULL,
        specifications JSONB NOT NULL,
        features JSONB NOT NULL,
        contact JSONB NOT NULL,
        images TEXT[] NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        listing_type VARCHAR(50) NOT NULL,
        price NUMERIC NOT NULL,
        location JSONB NOT NULL,
        specifications JSONB NOT NULL,
        features JSONB NOT NULL,
        contact JSONB NOT NULL,
        images TEXT[] NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
   
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        listing_type VARCHAR(50) NOT NULL,
        price NUMERIC NOT NULL,
        location JSONB NOT NULL,
        specifications JSONB NOT NULL,
        features JSONB NOT NULL,
        contact JSONB NOT NULL,
        images TEXT[] NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tables initialized successfully');
    
    await pool.end();
  } catch (err) {
    console.error('Error initializing tables:', err);
    throw err;
  }
}