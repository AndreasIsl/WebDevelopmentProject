import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createTables } from './config/init.db';
import { Pool } from 'pg';
import pool from './config/db.config';

const app = express();
const port = Number(process.env['PORT']) || 5001;

app.use(cors());
app.use(express.json());


// Initialize database and start server
// createTables()
//   .then((newPool) => {
//     pool = newPool;
//     const server = createServer(app);

//     server.on('error', (error: NodeJS.ErrnoException) => {
//       if (error.code === 'EADDRINUSE') {
//         const nextPort = port + 1;
//         console.log(`Port ${port} is busy, trying ${nextPort}`);
//         server.listen(nextPort);
//       } else {
//         console.error('Server error:', error);
//       }
//     });

//     server.listen(port, () => {
//       const address = server.address();
//       if (address && typeof address === 'object') {
//         console.log(`Server is running on port ${address.port}`);
//       }
//     });
//   })
//   .catch((error: Error) => {
//     console.error('Failed to initialize database:', error);
//     process.exit(1);
//   });

// API endpoints
//-------------------->Realestate
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

    const result = await pool.query(query, values);
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

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//-------------------->Register
app.get('/authen', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authen');
    res.json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    res.status(500).send('Server Error');
  }
});

// register user
app.post('/authen', async (req, res) => {
  try {
    const { UserName } = req.body;
    const { Password } = req.body;
    const { Email } = req.body;

    const result = await pool.query(
      'INSERT INTO authen (UserName,Password,Email) VALUES ($1, $2, $3) RETURNING *',
      [UserName, Password, Email]
    );
    res.json(result.rows[0]);
    console.log('User registered');
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    res.status(500).send('Server Error');
  }
});


// Check if username already exists (username has to be unique)
app.post('/authen/user', async (req, res) => {
  try {
    const { UserName } = req.body;
    // Check if the username already exists
    const userExistsQuery = await pool.query(
      'SELECT * FROM authen WHERE UserName = $1',
      [UserName]
    );

    if (userExistsQuery.rows.length > 0) {
      // Username already exists
      res.status(400).json({ error: 'Username already exists' });
    }

    res.status(200).json({ message: 'User does not exist, valid for registration' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//-------------------->Login
// login user
app.post('/authen/user/login', async (req, res) => {
  try {
    const { UserName } = req.body;
    const { Password } = req.body;

    const userExistsQuery = await pool.query(
      'SELECT * FROM authen WHERE username = $1',
      [UserName]
    );

    console.log(`${userExistsQuery.rows[0]}; name is ${UserName}; password is ${Password}`);
    if (userExistsQuery.rows.length > 0) {
      // Username exists
      let doesPasswordMatch = userExistsQuery.rows[0].password === Password;
      if (doesPasswordMatch) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(400).json({ message: 'Password is incorrect' });
      }
    } else {
      // Username does not exist
      res.status(400).json({ message: 'User does not exist' });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    res.status(500).send('Server Error');
  }
});

// check login data
app.get('/authen/user/login', async (req, res) => {
  try {
    const { UserName, Password } = req.query; // Get query parameters

    if (!UserName || !Password) {
       res.status(400).json({ message: 'Username and password are required' });
    }

    const userExistsQuery = await pool.query(
      'SELECT * FROM authen WHERE username = $1',
      [UserName]
    );

    console.log(`${userExistsQuery.rows[0]}; name is ${UserName}; password is ${Password}`);

    if (userExistsQuery.rows.length > 0) {
      // Username exists
      let doesPasswordMatch = userExistsQuery.rows[0].password === Password;
      if (doesPasswordMatch) {
         res.status(200).json({ message: 'Login successful' });
      } else {
         res.status(400).json({ message: 'Password is incorrect' });
      }
    } else {
      // Username does not exist
       res.status(400).json({ message: 'User does not exist' });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
     res.status(500).send('Server Error');
  }
});

//-------------------->Vehicles	
app.get('/vehicles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles');
    res.json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    res.status(500).send('Server Error');
  }
});

// Generell logic

//server start msg
app.listen(5000, () => console.log('Server started on port 5000'));

// Shutdown-Handler
const shutdownHandler = (signal: string) => {
  console.log(`\n[${new Date().toISOString()}] Signal ${signal} empfangen. Server wird heruntergefahren...`);
  process.exit(0);
};

// Signale abfangen
process.on('SIGINT', () => shutdownHandler('SIGINT'));  // Bei Ctrl+C
process.on('SIGTERM', () => shutdownHandler('SIGTERM'));  // Bei systemgesteuertem Herunterfahren

