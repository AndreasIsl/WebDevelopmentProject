const express = require('express');
const pool = require('./db');
const app = express();
const cors = require('cors');

app.use(express.json()); // Parse JSON
app.use(cors());


// Example GET endpoint
app.get('/authen', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authen');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Check if username already exists (username has to be unique)
app.post('/authen/user', async (req, res) => {
  try {
    const { UserName } = req.body;
    console.log(UserName);
    // Check if the username already exists
    const userExistsQuery = await pool.query(
      'SELECT * FROM authen WHERE UserName = $1',
      [UserName]
    );

    if (userExistsQuery.rows.length > 0) {
      // Username already exists
      return res.status(400).json({ error: 'Username already exists' });
    }

    return res.status(200).json({ message: 'User does not exist, valid for registration' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// login user
app.post('/authen/user/login', async (req, res) => {
  try {
    const { UserName } = req.body;
    const { Password } = req.body;

    const userExistsQuery = await pool.query(
      'SELECT * FROM authen WHERE UserName = $1',
      [UserName]
    );

    console.log(`${userExistsQuery.rows[0]?.UserName}; name is ${UserName}; password is ${Password}`);
    if (userExistsQuery.rows.length > 0) {
      // Username exists
      doesPasswordMatch = userExistsQuery.rows[0].password === Password;
      if (doesPasswordMatch) {
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(400).json({ message: 'Password is incorrect' });  
      }
    }


    // Username does not exist
    return res.status(400).json({ message: 'User does not exist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


//server start msg
app.listen(5000, () => console.log('Server started on port 5000'));

// Shutdown-Handler
const shutdownHandler = (signal) => {
    console.log(`\n[${new Date().toISOString()}] Signal ${signal} empfangen. Server wird heruntergefahren...`);
    process.exit(0); 
};
  
  // Signale abfangen
  process.on('SIGINT', () => shutdownHandler('SIGINT'));  // Bei Ctrl+C
  process.on('SIGTERM', () => shutdownHandler('SIGTERM'));  // Bei systemgesteuertem Herunterfahren
