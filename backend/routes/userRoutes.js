const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    saveMonthlySetup,
    getMonthlySetup // 👈 ADD THIS
  } = require('../controllers/userController');
  
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/setup', authMiddleware, saveMonthlySetup);
router.get('/setup', authMiddleware, getMonthlySetup);



module.exports = router;
