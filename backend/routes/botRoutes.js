const express = require('express');
const { askQuestion } = require('../controllers/botController');
const optionalAuth = require('../middlewares/optionalAuth');

const router = express.Router();

router.post('/ask', optionalAuth, askQuestion);

module.exports = router;