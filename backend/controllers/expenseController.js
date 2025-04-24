const db = require('../config/db');

exports.addExpense = (req, res) => {
    const userId = req.user.user_id;
    const { payment_method, amount, payment_id, description, date } = req.body;

    db.query(
        'INSERT INTO Expenses (user_id, payment_method, amount, payment_id, description, date) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, payment_method, amount, payment_id, description, date],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: 'Expense added successfully', expense_id: result.insertId });
        }
    );
};

exports.getExpenses = (req, res) => {
    const userId = req.user.user_id;

    db.query(
        'SELECT * FROM Expenses WHERE user_id = ? ORDER BY date DESC',
        [userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json(result);
        }
    );
};
