const express = require('express');
const router = express.Router();
const { addExpense, getExpenses } = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, addExpense);
router.get('/all', authMiddleware, getExpenses);

module.exports = router;
