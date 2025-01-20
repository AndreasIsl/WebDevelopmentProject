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

        // Drop existing table if it exists
        await realEstatePool.query(`
            DROP TABLE IF EXISTS listings
        `);

        // Create tables with explicit types
        await realEstatePool.query(`
            CREATE TABLE listings (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                property_type VARCHAR(50),
                listing_type VARCHAR(50),
                price VARCHAR(50),
                location JSONB,
                specifications JSONB,
                features JSONB,
                contact JSONB,
                images VARCHAR[],
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert test listing
        await realEstatePool.query(`
            INSERT INTO listings (
                title,
                property_type,
                listing_type,
                price,
                location,
                specifications,
                features,
                contact,
                images,
                description
            ) VALUES (
                $1::varchar,
                $2::varchar,
                $3::varchar,
                $4::varchar,
                $5::jsonb,
                $6::jsonb,
                $7::jsonb,
                $8::jsonb,
                $9::varchar[],
                $10::text
            )
        `, [
            'Test Listing',
            'house',
            'buy',
            '500000',
            JSON.stringify({
                country: 'Austria',
                city: 'Vienna',
                postalCode: '1010',
                street: 'Test Street 1'
            }),
            JSON.stringify({
                livingArea: 150,
                rooms: 4
            }),
            JSON.stringify({
                hasBalcony: true,
                hasGarden: true,
                heating: ['gas'],
                floors: ['parquet']
            }),
            JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                phone: '+43 123 456789'
            }),
            ['./assets/images/home.jpg'],
            'Test description'
        ]);

        console.log('Tables initialized successfully');
        
        await dbPool.end();
        return realEstatePool;
    } catch (err) {
        console.error('Error initializing tables:', err);
        throw err;
    }
} 