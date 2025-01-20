import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createTables } from './config/init.db';
import { Pool } from 'pg';

const app = express();
const port = Number(process.env['PORT']) || 3001;

app.use(cors());
app.use(express.json());

let dbPool: Pool;

// Initialize database and start server
createTables()
  .then((newPool) => {
    dbPool = newPool;
    const server = createServer(app);

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        const nextPort = port + 1;
        console.log(`Port ${port} is busy, trying ${nextPort}`);
        server.listen(nextPort);
      } else {
        console.error('Server error:', error);
      }
    });

    server.listen(port, () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        console.log(`Server is running on port ${address.port}`);
      }
    });
  })
  .catch((error: Error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// API endpoints
app.get('/api/listings', async (req, res) => {
  try {
    const { propertyType, listingType } = req.query;
    let query = 'SELECT * FROM listings WHERE 1=1';
    const values: any[] = [];

    if (propertyType) {
      values.push(propertyType);
      query += ` AND property_type = $${values.length}`;
    }

    if (listingType) {
      values.push(listingType);
      query += ` AND listing_type = $${values.length}`;
    }

    const result = await dbPool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/listings', async (req, res) => {
  try {
    const listing = req.body;
    const query = `
      INSERT INTO listings (
        title, property_type, listing_type, price, 
        location, specifications, features, contact, 
        images, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      listing.title,
      listing.propertyType,
      listing.listingType,
      listing.price,
      listing.location,
      listing.specifications,
      listing.features,
      listing.contact,
      listing.images,
      listing.description
    ];

    const result = await dbPool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const reqHandler = app;
