const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS package

const app = express();
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Prisum@1996', // Replace with your actual MySQL password
    database: 'connectify'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }
    console.log('Connected to MySQL database');
});

// User Registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.error('Error querying users:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.error('Error querying users:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, result[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a token
        const token = jwt.sign({ id: result[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
});

// Middleware to verify the token and get user profile
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = decoded.id;  // Attach user id to the request object
        next();
    });
};

// Fetch user profile (example of a protected route)
app.get('/profile', verifyToken, (req, res) => {
    db.query('SELECT id, email FROM users WHERE id = ?', [req.userId], (err, result) => {
        if (err) {
            console.error('Error querying user profile:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (result.length > 0) {
            res.json({ profile: result[0] });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
