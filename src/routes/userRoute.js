const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const { signupLimiter, loginLimiter } = require('../middleware/rateLimiter');
const sanitizeInput = require('../middleware/sanitizeInput');

router.post("/signup", signupLimiter, sanitizeInput, signup);
router.post("/login", loginLimiter, login);

module.exports = router;