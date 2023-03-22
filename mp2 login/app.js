const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'aria123',
  database: 'nodejs',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Sign Up route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Received data:', req.body);

  const query = 'INSERT INTO login_user (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(`An error occurred while signing up: ${err.message}`);
    } else {
      res.status(201).send('User created successfully');
    }
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM login_user WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) throw err;

    const user = result[0];

    if (user && user.password === password) {
      res.redirect('/dashboard.html');
    } else {
      res.send('Invalid email or password');
    }
  });
});

// Get all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM login_user';
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while fetching users');
    } else {
      res.status(200).json(result);
    }
  });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const query = 'UPDATE login_user SET name = ?, email = ?, password = ? WHERE id = ?';
  db.query(query, [name, email, password, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while updating the user');
    } else {
      res.status(200).send('User updated successfully');
    }
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM login_user WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while deleting the user');
    } else {
      res.status(200).send('User deleted successfully');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
