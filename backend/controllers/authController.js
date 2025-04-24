const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// === REGISTER USER ===
exports.registerUser = async (req, res) => {
    const { name, email, phone_number, budget, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        db.query('SELECT * FROM User WHERE email = ?', [email], (err, result) => {
            if (err) {
                console.error("Email Check Error:", err);
                return res.status(500).json({ error: "Server error" });
            }

            if (result.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Register new user
            db.query(
                'INSERT INTO User (name, email, phone_number, budget, password) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone_number, budget, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error("Insert Error:", err);
                        return res.status(500).json({ error: "Server error" });
                    }

                    const user_id = result.insertId;
                    const token = jwt.sign({ user_id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

                    res.status(201).json({ message: "Registered successfully", token, user_id });
                }
            );
        });

    } catch (err) {
        console.error("Hashing Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// === LOGIN USER ===
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM User WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.error("Login Query Error:", err);
            return res.status(500).json({ error: "Server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            const token = jwt.sign({ user_id: user.user_id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(200).json({ message: "Login successful", token, user_id: user.user_id });
        } catch (err) {
            console.error("Password Compare Error:", err);
            res.status(500).json({ error: "Server error" });
        }
    });
};
