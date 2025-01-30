const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

// Middleware for parsing JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost',  // Your database host
  user: 'root',       // Your database username
  password: 'ram',       // Your database password
  database: 'restaurant'  // Your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    console.log('Connected to the database');
  }
});

// Serve the login form HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle form submission
app.post('/login', (req, res) => {
  const { name,email, password } = req.body;

  // SQL query to check if the user exists
  const query = 'SELECT * FROM user WHERE name=? AND email = ? AND password = ?';

  db.query(query, [name,email, password], (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      // If user found, redirect to index.html
      res.redirect('/index.html');
    } else {
      // If user not found, show error
      res.send('Invalid email or password');
    }
  });
});

// Serve index.html (for redirect after successful login)
app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
