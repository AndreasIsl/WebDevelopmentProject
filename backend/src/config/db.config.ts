import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

// Test the database connection
dbPool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

export default dbPool; 