const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test Database Connection
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Middleware for JSON parsing
app.use(express.json());

// 1. Retrieve all patients
app.get('/', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 3. Filter patients by first name
app.get('/:firstName', (req, res) => {
    const { firstName } = req.params;
    const query = 'SELECT * FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 4. Retrieve providers by specialty
app.get('/providers/:specialty', (req, res) => {
    const { specialty } = req.params;
    const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Listen to server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
