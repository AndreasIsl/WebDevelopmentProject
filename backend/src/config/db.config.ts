import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config({path : '.env'});

// console.log(process.env.REACT_APP_DB_USER);
// console.log(process.env.REACT_APP_DB_HOST);
// console.log(process.env.REACT_APP_DB_NAME);
// console.log(process.env.REACT_APP_DB_PASSWORD);

// const pool = new Pool({
//     user: process.env['DB_USER'],
//     host: process.env['DB_HOST'],
//     database: process.env['DB_NAME'],
//     password: process.env['DB_PASSWORD'] as string,
//     port: process.env['DB_PORT'] ? parseInt(process.env['DB_PORT']) : undefined,
// });

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "WebdevProject",
    password: "admin",
    port: 5432,
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