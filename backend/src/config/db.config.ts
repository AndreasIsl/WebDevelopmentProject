import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

console.log(process.env['DB_USER']);
console.log(process.env['DB_HOST']);
console.log(process.env['DB_NAME']);
console.log(process.env['DB_PASSWORD']);

const pool = new Pool({
    user: process.env['DB_USER'],
    host: process.env['DB_HOST'],
    database: process.env['DB_NAME'],
    password: process.env['DB_PASSWORD'] as string,
    port: process.env['DB_PORT'] ? parseInt(process.env['DB_PORT']) : undefined,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

export default pool; 