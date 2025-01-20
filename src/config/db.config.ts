import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env['DB_USER'] || 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    database: process.env['DB_NAME'] || 'mochtehaben_db',
    password: process.env['DB_PASSWORD'] || 'postgres',
    port: parseInt(process.env['DB_PORT'] || '5432'),
});

// Test the database connection
pool.query('SELECT NOW()', (err: Error | null, res: any) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

export default pool; 