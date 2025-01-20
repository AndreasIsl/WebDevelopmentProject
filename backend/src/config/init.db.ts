import { Pool } from 'pg';
import dbPool from './db.config';

export async function createTables(): Promise<Pool> {
  try {
    // First create the database if it doesn't exist
    await dbPool.query(`
      SELECT 'CREATE DATABASE realestate'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'realestate')
    `).catch(() => {
      console.log('Database might already exist, continuing...');
    });

    // Connect to the realestate database
    const realEstatePool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'realestate',
      password: 'postgres',
      port: 5432,
    });

    // Create tables
    await realEstatePool.query(`
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
    
    // Close the initial pool and return the new one
    await dbPool.end();
    return realEstatePool;
  } catch (err) {
    console.error('Error initializing tables:', err);
    throw err;
  }
}

// Export a function to get a new pool connection
export function getPool(): Pool {
  return new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'realestate',
    password: 'postgres',
    port: 5432,
  });
}