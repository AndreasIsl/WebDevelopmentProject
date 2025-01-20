import { Pool } from 'pg';

// Create a pool for connecting to the postgres database to create our application database
const initPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Connect to default postgres database
  password: 'your_password',  // Replace with your actual password
  port: 5432,
});

// Create a pool for our application database
const appPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'real_estate_db',
  password: 'your_password',  // Replace with your actual password
  port: 5432,
});

export async function initializeDatabase() {
  const pool = new Pool({
    user: process.env['DB_USER'] || 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    database: process.env['DB_NAME'] || 'real_estate_db',
    password: process.env['DB_PASSWORD'] || 'your_password',
    port: parseInt(process.env['DB_PORT'] || '5432'),
  });

  try {
    // First, connect to postgres database to create our application database
    const client = await initPool.connect();
    
    try {
      // Check if database exists
      const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = 'real_estate_db'"
      );
      
      // Create database if it doesn't exist
      if (result.rowCount === 0) {
        await client.query('CREATE DATABASE real_estate_db');
        console.log('Database created successfully');
      }
    } finally {
      client.release();
    }

    // Now connect to our application database and create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS real_estate_listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        listing_type VARCHAR(50) NOT NULL,
        price DECIMAL NOT NULL,
        location JSONB NOT NULL,
        specifications JSONB NOT NULL,
        features JSONB,
        contact JSONB NOT NULL,
        images TEXT[],
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      );
    `);

    console.log('Tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export default appPool; 