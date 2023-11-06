const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require("express-rate-limit");
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limits
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

//  Apply to all requests
app.use(limiter);

// Routes

// Sign In
app.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length > 0 && bcrypt.compareSync(password, user.rows[0].password)) {
            const token = jwt.sign({ userId: user.rows[0].id }, secret);
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
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *", [username, hashedPassword, email]);
        const token = jwt.sign({ userId: newUser.rows[0].id }, secret);
        res.json({ token });
    } catch (error) {
        if (error.code === '23505') {
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

// Recover Password
app.post("/forgotpassword", async (req, res) => {
    try { 
        const { email } = req.body;
        const user = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(404).json("User with the provided email not found.");
        }

        const userId = user.rows[0].user_id;
        await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [userId]);
        const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
        await pool.query("INSERT INTO password_reset_tokens (user_id, token, expiry_date) VALUES ($1, $2, NOW() + INTERVAL '1 hour')", [userId, token]);

        // TODO: Integrate logic here to send the token to the user's email

        res.json({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
});

app.get("/verifyresettoken/:resetToken", async (req, res) => {
    try {
        const { resetToken } = req.params;
        const tokenVerify = await pool.query("SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expiry_date > NOW()", [resetToken]);

        if (tokenVerify.rows.length > 0) {
            res.status(200).json({ message: "Token is valid." });
        } else {
            res.status(404).json("Invalid or expired reset token.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
});

app.post("/resetpassword", async (req, res) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json("Passwords do not match.");
        }

        const tokenVerify = await pool.query(
            "SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expiry_date > NOW()", 
            [resetToken]
        );

        if (tokenVerify.rows.length === 0) {
            return res.status(404).json("Invalid or expired reset token.");
        }

        // Retrieve the current password for the user from the database
        const currentUser = await pool.query(
            "SELECT password FROM users WHERE user_id = $1", 
            [tokenVerify.rows[0].user_id]
        );

        // Check if the new password is same as the old password
        if (bcrypt.compareSync(newPassword, currentUser.rows[0].password)) {
            return res.status(409).json("The new password cannot be the same as your current password.");
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, tokenVerify.rows[0].user_id]);

        // Remove the reset token from the database.
        await pool.query("DELETE FROM password_reset_tokens WHERE token = $1", [resetToken]);

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
});

app.listen(3001, () => {
    console.log('The server is running on port 3001');
});

