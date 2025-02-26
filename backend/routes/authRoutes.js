const express = require('express');

const { register, login, getCurrentUser } = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;