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

// Example POST endpoint
app.post('/authen', async (req, res) => {
  try {
    const { UserName } = req.body;
    const { Password } = req.body;

    const result = await pool.query(
      'INSERT INTO authen (UserName,Password) VALUES ($1, $2) RETURNING *',
      [UserName, Password]
    );
    res.json(result.rows[0]);
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
