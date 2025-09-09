const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const { signupLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { sanitizeSignup, sanitizeLogin } = require('../middleware/sanitizeInput');
const { signupValidationRules, loginValidationRules, validate } = require('../middleware/validateInput');

router.post("/signup", signupLimiter, sanitizeSignup, signupValidationRules(), validate, signup);
router.post("/login", loginLimiter, sanitizeLogin, loginValidationRules(), validate, login);

module.exports = router;