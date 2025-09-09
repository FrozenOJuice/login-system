const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const { signupLimiter, loginLimiter } = require('../middleware/rateLimiter');

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);

module.exports = router;