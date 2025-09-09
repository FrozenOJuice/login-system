const express = require('express');
const { signup, login } = require('../controllers/userController');
const validate = require('../middleware/validate');
const { createUserValidator } = require('../middleware/userValidators');
const { body } = require('express-validator');

const router = express.Router();

// Signup
router.post('/signup', validate(createUserValidator), signup);

// Login
router.post(
    '/login',
    validate([
        body('email').isEmail().withMessage('Valid email required'),
        body('password').notEmpty().withMessage('Password required'),
    ]),
    login
);

module.exports = router;
