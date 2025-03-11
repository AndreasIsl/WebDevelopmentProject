import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createTables } from './config/init.db';
import { Pool } from 'pg';
import pool from './config/db.config';
import { Console } from 'console';

const jwt = require('jsonwebtoken');
const app = express();
const port =  5001;

const SECRET_KEY = 'lets pretend that im a secret key very secure and not just a String in a file';

interface AuthRequest extends Request {
  user?: {username: string, password: string, email: string ,img: string[]}; // oder spezifischer: { username: string, role: string }
}

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

app.get('/listauth', async (req, res) => {
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

//-------------------->Register
// register user
app.post('/auth/register', async (req: any, res: any) => {
  try {
    const { username } = req.body;
    const { password } = req.body;
    const { email } = req.body;

    const checkUser = await pool.query( 'SELECT * FROM authen WHERE username = $1', [username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });  
    }

    let idQuery = await pool.query( 'SELECT MAX(id) AS groesste_id FROM authen');
    const id = parseInt(idQuery.rows[0].groesste_id,10) + 1;

    const result = await pool.query(
      'INSERT INTO authen (username,password,email,id) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, password, email, id]
    );
    console.log('User registered');

    const token = jwt.sign({ username: username, password: password, email: email ,id: id }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token, id });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    return res.status(500).send('Server Error');
  }
});


//-------------------->Login
// login user
app.get('/auth/login', async (req : any, res: any) => {
  try {
    const { username, password } = req.query;
    const userExistsQuery = await pool.query(
      'SELECT * FROM authen WHERE username = $1',
      [username]
    );
    if (userExistsQuery.rows.length > 0 && userExistsQuery.rows[0].password === password) {
      console.log("Auth Login :" + userExistsQuery.rows);
      const email = userExistsQuery.rows[0].email;
      const image = userExistsQuery.rows[0].image;
      const id = userExistsQuery.rows[0].id;

      const token = jwt.sign({ username: username, password: password, email: email, image: image, id: id }, SECRET_KEY, { expiresIn: '1h' });
      return res.status(200).json({ token, id });
    } else {
      return res.status(400).json({ message: 'Login data is incorrect' });
    }
  } catch (err) {
    return res.status(500).send('Server Error');
  }
});

app.get('/auth/user/:id', async (req : any, res: any) => {
  try {
    const  id  = req.params.id;
    const query = await pool.query(
      'SELECT username FROM authen WHERE id = $1',
      [id]
    );

    console.log(query.rows);
    if (query.rows.length > 0) {
      return res.status(200).json( query.rows[0] );
    } else {
      return res.status(400).json({ message: '/auth/:id : get auth per id user not found' });
    }
  } catch (err) {
    return res.status(500).send('Server Error');
  }
});

// 🚀 Geschützte Route
app.get('/auth/protected', verifyToken, (req: AuthRequest, res : any) => {
  res.status(200).json({ message: 'Erfolgreicher Zugriff auf geschützte Daten', user: req.user });
});

// Middleware zur Token-Verifizierung
function verifyToken(req : any, res : any, next: any) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Kein Token vorhanden' });
  }

  jwt.verify(token, SECRET_KEY, (err : any, decoded : any) => {
    if (err) {
      return res.status(403).json({ message: 'Ungültiges Token' });
    }

    req.user = decoded;
    next();
  });
}

// update User
app.put('/auth/update', async (req, res) => {
  const { username, password, email, id } = req.body;
  console.log('username:', username);
  console.log('password:', password);
  console.log('email:', email);
  console.log('id:', id);
  try{
    const updateUserQuery = await pool.query(
      'UPDATE authen SET email = $1, username = $2, password = $3 WHERE id = $4',
      [email, username, password, id]
    );
  
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err : any) {
    res.status(500).send('Server Error :' + err.message);
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

app.post('/vehicle', async (req: any, res: any) => {
  try {
    const { id } = req.body;
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    console.log(result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    return res.status(500).send('Server Error');
  }
});

//getvehicle by CreatorId
app.post('/vehicles/creatorid', async (req: any, res: any) => {
  try {
    const { id } = req.body;
    const result = await pool.query('SELECT * FROM vehicles WHERE ersteller_id = $1', [id]);
    return res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    return res.status(500).send('Server Error');
  }
});

//addvehicle
app.post('/vehicles/newvehicle', async (req: any, res: any) => {
  try {
    const { brand,model,manufactoringDate,mileage,price,creatorID } = req.body;
    let idQuery = await pool.query( 'SELECT MAX(id) AS groesste_id FROM vehicles');
    const id = parseInt(idQuery.rows[0].groesste_id,10) + 1;
    console.log('id: ' + id)

    const result = await pool.query(`INSERT INTO vehicles(
	id, marke, modell, baujahr, kilometerstand, preis, ersteller_id)
	VALUES ($1, $2, $3, $4, $5, $6, $7)`, [id,brand,model,manufactoringDate,mileage,price,creatorID]);
    return res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    return res.status(500).send('Server Error');
  }
});

//delete by id
app.delete('/vehicles/:id', async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    console.log(id);
    return res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    return res.status(500).send('Server Error');
  }
});


//update vehicle
app.put('/vehicle/update', async (req, res) => {
  const { price, mileage, manufacturingdate,description, id } = req.body;
  try{
    const updateUserQuery = await pool.query(
      'UPDATE vehicles SET preis = $1, kilometerstand = $2, baujahr = $3, beschreibung = $4 WHERE id = $5',
      [ price, mileage, manufacturingdate,description, id]
    );
  
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err : any) {
    res.status(500).send('Server Error :' + err.message);
  }
});



//-------------------->Messages
//get messages by id 
app.get('/messages/:id', async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const sended = await pool.query('SELECT * FROM messages WHERE senderid = $1', [id]);
    const recieved = await pool.query('SELECT * FROM messages WHERE recieverid = $1', [id]);

    let result = sended.rows.concat(recieved.rows);
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error:', err);
    }
    return res.status(500).send('Server Error');
  }
});

//add message
app.post('/messages', async (req: any, res: any) => {
  try {
    const { senderid,recieverid,message} = req.body;
    let idQuery = await pool.query( 'SELECT MAX(messageid) AS groesste_id FROM messages');
    const id = parseInt(idQuery.rows[0].groesste_id,10) + 1;

    const result = await pool.query(`INSERT INTO messages (messageid, senderid, recieverid, text) VALUES ($1, $2, $3, $4)`,
       [id,senderid,recieverid,message]);
    return res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Database error:", err);
    } else {
      console.error('Unknown error:', err);
    }
    return res.status(500).send('Server Error');
  }
});

//-------------------->Generell logic
//server start msg
app.listen(port, () => console.log(`Server started on port ${port}`));	

// Shutdown-Handler
const shutdownHandler = (signal: string) => {
  console.log(`\n[${new Date().toISOString()}] Signal ${signal} empfangen. Server wird heruntergefahren...`);
  process.exit(0);
};

// Signale abfangen
process.on('SIGINT', () => shutdownHandler('SIGINT'));  // Bei Ctrl+C
process.on('SIGTERM', () => shutdownHandler('SIGTERM'));  // Bei systemgesteuertem Herunterfahren

