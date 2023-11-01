const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Sign In
app.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length > 0 && bcrypt.compareSync(password, user.rows[0].password)) {
            // Passwords match, generate a token
            const token = jwt.sign({ userId: user.rows[0].id }, 'your_jwt_secret');
            res.json({ token });
        } else {
            res.status(401).json("Invalid Credentials");
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server Error");
    }
});

// Register User
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert the user into the database
        const newUser = await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *", [username, hashedPassword, email]);

        // Generate a token
        const token = jwt.sign({ userId: newUser.rows[0].id }, 'your_jwt_secret');
        res.json({ token });
    } catch (error) {
        if (error.code === '23505') {
            // Check which field caused the unique violation
            if (error.detail.includes("username")) {
                res.status(409).json("Username already exists");
            } else if (error.detail.includes("email")) {
                res.status(409).json("Email already exists");
            }
        } else {
            res.status(500).json("Server Error");
        }
    }
});

app.listen(3001, () => {
    console.log('The server is running on port 3001');
});

// Recover Password
app.post("/forgotpassword", async (req, res) => {
    try {
        // Implement the password recovery logic here
    } catch (error) {
        // Handle errors
    }
});