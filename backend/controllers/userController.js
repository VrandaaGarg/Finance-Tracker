const db = require('../config/db');

exports.getUserProfile = (req, res) => {
    const userId = req.user.user_id;

    db.query('SELECT user_id, name, email, phone_number, budget FROM User WHERE user_id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(404).json({ message: "User not found" });

        res.status(200).json(result[0]);
    });
};

exports.updateUserProfile = (req, res) => {
    const userId = req.user.user_id;
    const { name, email, phone_number, budget } = req.body;

    db.query(
        'UPDATE User SET name = ?, email = ?, phone_number = ?, budget = ? WHERE user_id = ?',
        [name, email, phone_number, budget, userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ message: "Profile updated successfully" });
        }
    );
};

exports.saveMonthlySetup = (req, res) => {
    const userId = req.user.user_id;
    const { month, income, budget } = req.body;
  
    if (!month || !income || !budget) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const query = 'INSERT INTO monthly_settings (user_id, month, income, budget) VALUES (?, ?, ?, ?)';
  
    db.query(query, [userId, month, income, budget], (err, result) => {
      if (err) {
        console.error("Insert Setup Error:", err);
        return res.status(500).json({ error: "Failed to save setup" });
      }
  
      return res.status(201).json({ message: 'Monthly setup saved!', id: result.insertId });
    });
  };
  

  exports.getMonthlySetup = (req, res) => {
    const userId = req.user.user_id;
    const month = new Date().toLocaleString('default', { month: 'long' });
  
    db.query(
      'SELECT * FROM monthly_settings WHERE user_id = ? AND month = ? ORDER BY created_at DESC LIMIT 1',
      [userId, month],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(404).json({ message: 'No setup found' });
        res.status(200).json(result[0]);
      }
    );
  };
  
