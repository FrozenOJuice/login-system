const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const { signupLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { sanitizeSignup, sanitizeLogin } = require('../middleware/sanitizeInput');

router.post("/signup", signupLimiter, sanitizeSignup, signup);
router.post("/login", loginLimiter, sanitizeLogin, login);

module.exports = router;