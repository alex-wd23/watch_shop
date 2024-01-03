const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require("express-rate-limit");
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
const transporter = require('./transporter');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');




// Middleware
const corsOptions = {
    origin: ['https://localhost:3000', 'https://192.168.1.236:3000'], // Front-end origin
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200 
  };

const options = {
    key: fs.readFileSync('certificates/localhost+2-key.pem'),
    cert: fs.readFileSync('certificates/localhost+2.pem')
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions)); 

// Apply rate limits
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

//  Apply to all requests
// app.use(limiter);

// Routes

//////////////////////////////////////////////
// Login Section
/////////////////////////////////////////////


// Sign In
app.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length > 0 && bcrypt.compareSync(password, user.rows[0].password)) {
            const token = jwt.sign({ userId: user.rows[0].user_id }, secret, { expiresIn: '1h' });
            res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // secure: true in production
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
            });
            res.status(200).json({ message: "Authentication successful" });
            
        } else {
            res.status(401).json("Invalid Credentials");
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server Error");
    }
});

// Check authentication
app.get("/checkAuth", (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json("No authentication token");
      }
  
      jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json("Token is not valid");
  
        res.status(200).json({ message: "Authenticated", user });
      });
    } catch (error) {
      res.status(500).json("Server Error");
    }
  });

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out successfully" });
});

// Register User
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!/^[A-Za-z0-9.]{7,}$/.test(username)) {
            return res.status(400).json("Username must be more than 6 characters and can include letters, numbers, and the dot character.");
        }
        
        // Server-side password validation
        if (password.length < 8 || !/^[A-Za-z0-9]+$/.test(password) || password.toLowerCase() === 'abcd1234') {
            return res.status(400).json("Password must be at least 8 characters long and must include both letters and numbers, but cannot be 'abcd1234'.");
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *", [username, hashedPassword, email]);
         // Assuming the new user was added successfully and is returned
         const user = newUser.rows[0];

         // Create a token for the new user
         const token = jwt.sign({ userId: user.user_id }, secret, { expiresIn: '1h' });
 
         // Set the token in an HttpOnly cookie
         res.cookie('token', token, {
             httpOnly: true,
             secure: process.env.NODE_ENV !== 'development', // secure: true in production
             sameSite: 'strict',
             maxAge: 3600000 // 1 hour
         });
 
         res.status(201).json({ message: "User registered successfully", user });
        
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

        // Compose the password reset URL
        const resetUrl = `http://localhost:3000/watch_shop/#reset/${token}`;

        // Send the password reset email
        const mailOptions = {
            from: '"WatchShop" <support@watchshop.com>', // sender address
            to: 'moraru.i.alexandru@gmail.com', // list of receivers
            subject: "Password Reset", // Subject line
            text: "Please use the following link to reset your password: " + resetUrl, // plain text body
            html: `<p>Please use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>` // html body
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });

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

        const mailOptions = {
            from: '"WatchShop" <support@watchshop.com>', // sender address
            to: 'moraru.i.alexandru@gmail.com', // list of receivers
            subject: "Password Reset", // Subject line
            text: "The password was reset successfully. ",  // plain text body
            html: `<p>The password was reset successfully.</p>` // html body
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
});

// Endpoint to get user data
app.get("/userData", async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json("No authentication token");
      }
  
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) return res.status(403).json("Token is not valid");
  
        const userId = decoded.userId;
        const userData = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
        // Exclude password and any sensitive information from the response
        const { password, ...userDetails } = userData.rows[0];
        res.json(userDetails);
      });
    } catch (error) {
      res.status(500).json("Server Error");
    }
  });

// Endpoint user settings
app.put('/user/settings', async (req, res) => {
    const { userId, type, email, username, oldPassword, newPassword } = req.body;

    try {
        switch(type) {
            case 'email':
                // Update email
                await pool.query("UPDATE users SET email = $1 WHERE user_id = $2", [email, userId]);
                res.status(200).json("Email updated successfully");
                break;

            case 'username':
                // Update username
                await pool.query("UPDATE users SET username = $1 WHERE user_id = $2", [username, userId]);
                res.status(200).json("Username updated successfully");
                break;

            case 'password':
                // Update password
                const user = await pool.query("SELECT password FROM users WHERE user_id = $1", [userId]);
                
                if (user.rows.length === 0) {
                    return res.status(404).json("User not found");
                }

                const validPassword = bcrypt.compareSync(oldPassword, user.rows[0].password);
                if (!validPassword) {
                    return res.status(400).json("Invalid old password");
                }

                const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
                await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedNewPassword, userId]);
                res.status(200).json("Password updated successfully");
                break;

            default:
                return res.status(400).json("Invalid update type");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//////////////////////////////////////////////
// Shop Section
/////////////////////////////////////////////

app.get("/products", async (req, res) => {
    try {
        const allProducts = await pool.query("SELECT * FROM watches ORDER BY id ASC");

        // Convert the price to a number
        const productsWithConvertedPrices = allProducts.rows.map(product => ({
          ...product,
          price: parseFloat(product.price)
        }));

        res.json(productsWithConvertedPrices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get("/filter", async (req, res) => {
    const {
        beltMaterial, dialSize, mechanism, waterproof, 
        specialFunctions, dialColor, braceletColor, priceRange1, priceRange2
    } = req.query;

    let query = "SELECT * FROM watches";
    let conditions = [];
    let params = [];
    let paramCounter = 1;

    const addFilterCondition = (filterArray, columnName) => {
        if (filterArray && filterArray.length) {
            let placeholders = filterArray.map(_ => `$${paramCounter++}`);
            conditions.push(`${columnName} IN (${placeholders.join(', ')})`);
            params.push(...filterArray);
        }
    };

    // Add conditions based on provided filters
    addFilterCondition(beltMaterial, "belt_material");
    addFilterCondition(dialSize, "dial_size");
    addFilterCondition(mechanism, "mechanism");
    addFilterCondition(waterproof, "waterproof");
    addFilterCondition(specialFunctions, "special_functions");
    addFilterCondition(dialColor, "dial_color");
    addFilterCondition(braceletColor, "bracelet_color");

    if (priceRange1 && priceRange2) {
        conditions.push(`price BETWEEN $${paramCounter} AND $${paramCounter + 1}`);
        params.push(priceRange1, priceRange2);
        paramCounter += 2;
    }

    // Combine conditions into the query
    if (conditions.length) {
        query += " WHERE " + conditions.join(" AND ");
    }

    try {
        const filteredProducts = await pool.query(query, params);
        res.json(filteredProducts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


//////////////////////////////////////////////
// Checkout Section
/////////////////////////////////////////////

app.post('/checkout', async (req, res) => {
    const { user_id, email, firstName, lastName, address, apartment, phone, items, total } = req.body;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneNumberRegex = /^\+?\d{10,15}$/; // Regex for phone number validation
    let errors = {};
    if (!email || !emailRegex.test(email.trim())) {
        errors.email = 'Please provide a valid email.';
    }
    if (!firstName || firstName.trim() === '') errors.firstName = 'Please provide a first name.';
    if (!lastName || lastName.trim() === '') errors.lastName = 'Please provide a last name.';
    if (!address || address.trim() === '') errors.address = 'Please provide an address.';
    if (!phone || phone.trim() === '') errors.phone = 'Please provide a phone number.';
    if (!phoneNumberRegex.test(req.body.phone.trim())) {
        errors.phone = 'Please provide a valid phone number.';
    }

    // Check if there are any errors
    if (Object.keys(errors).length !== 0) {
        return res.status(400).json({errors});
        
    }

    try {
        // Insert into orders table
        const newOrder = await pool.query(
            "INSERT INTO orders (user_id, email, first_name, last_name, address, apartment, phone, total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [user_id, email, firstName, lastName, address, apartment, phone, total]
        );

        const orderId = newOrder.rows[0].order_id;

        // Insert each item into order_items table
        items.forEach(async item => {
            await pool.query(
                "INSERT INTO order_items (order_id, watch_id, quantity) VALUES ($1, $2, $3)",
                [orderId, item.id, item.quantity]
            );
        });

        res.status(201).json({ message: "Order processed successfully", orderId: orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
});

// Endpoint to query the stock
app.post('/updateStock', async (req, res) => {
    try {
        const { watch_id, quantity } = req.body;
        const updateStock = await pool.query(
            "UPDATE watches SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING *",
            [quantity, watch_id]
        );

        if (updateStock.rows.length > 0) {
            res.json({ message: "Stock updated successfully", updatedProduct: updateStock.rows[0] });
        } else {
            res.status(400).json("Not enough stock or product not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

// Endpoint to update stock after a purchase
app.get('/getStock', async (req, res) => {
    const { watch_id } = req.query;
    try {
        const stock = await pool.query(
        "SELECT stock from watches where id = $1",[watch_id]
        );
        if (stock.rows.length > 0) {
            res.json(stock.rows[0].stock); // Send the stock number as a response
        } else {
            res.status(404).json("Product not found");
        }
    } catch (error) {
        res.status(500).json("Server Error");
    }
});

//////////////////////////////////////////////
// Orders Section
/////////////////////////////////////////////

app.get('/user/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await pool.query(`
            SELECT
                o.order_id,
                o.order_date,
                o.status,
                o.total,
                array_agg(json_build_object('name', w.name, 'quantity', oi.quantity)) as products
            FROM
                orders o
            JOIN
                order_items oi ON o.order_id = oi.order_id
            JOIN
                watches w ON oi.watch_id = w.id
            WHERE
                o.user_id = $1
            GROUP BY
                o.order_id
            ORDER BY
                o.order_date DESC
        `, [userId]);

        res.json(orders.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json("Server Error");
    }
});


app.put('/user/orders/cancel/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
      const updateResult = await pool.query(
        "UPDATE orders SET status = 'Canceled' WHERE order_id = $1 RETURNING *",
        [orderId]
      );
  
      if (updateResult.rows.length > 0) {
        res.json({ message: "Order canceled successfully", order: updateResult.rows[0] });
      } else {
        res.status(404).json("Order not found");
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      res.status(500).json("Server Error");
    }
  });

//////////////////////////////////////////////
// ACcount Details
/////////////////////////////////////////////

// Fetch addresses for a user
app.get('/user/address/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await pool.query("SELECT * FROM addresses WHERE user_id = $1", [userId]);
      res.json(result.rows); // Send the addresses as an array
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  });
  
  // Add a new address for a user
  app.post('/user/address', async (req, res) => {
    const { userId, address } = req.body;
    try {
      await pool.query("INSERT INTO addresses (user_id, address) VALUES ($1, $2)", [userId, address]);
      res.status(201).json({ message: "Address added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  });
  
  // Remove an address for a user
  app.delete('/user/address/:userId/:addressId', async (req, res) => {
    const { userId, addressId } = req.params;
    try {
      await pool.query("DELETE FROM addresses WHERE user_id = $1 AND address_id = $2", [userId, addressId]);
      res.status(200).json({ message: "Address removed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  });

// 0.0.0.0 used for testing on phone
// app.listen(3001, '0.0.0.0', () => {
//     console.log('The server is running on port 3001');
// });


// HTTPS setup
https.createServer(options, app).listen(3001, () => {
    console.log('HTTPS server running on port 3001');
});