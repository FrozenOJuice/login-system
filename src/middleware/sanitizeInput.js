const { body, validationResult } = require('express-validator');

const removeInvisibleChars = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F]/g, '');
};

const sanitizeSignup = [
    body('name')
        .customSanitizer(removeInvisibleChars)
        .trim()
        .escape()
        .matches(/^[a-zA-Z\s-]+$/).withMessage('Name can only contain letters, spaces, and hyphens')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .customSanitizer(removeInvisibleChars)
        .trim()
        .normalizeEmail({ gmail_remove_dots: false })
        .isEmail().withMessage('Invalid email address')
        .toLowerCase(),

    body('password')
        .customSanitizer(removeInvisibleChars)
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const sanitizeLogin = [
    body('email')
        .customSanitizer(removeInvisibleChars)
        .trim()
        .normalizeEmail({ gmail_remove_dots: false })
        .isEmail().withMessage('Invalid email address')
        .toLowerCase(),

    body('password')
        .customSanitizer(removeInvisibleChars)
        .trim()
        .notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    sanitizeSignup,
    sanitizeLogin
};