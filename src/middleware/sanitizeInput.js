const { body, validationResult } = require('express-validator');

// Utility to remove invisible/control characters
const removeInvisibleChars = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F]/g, '');
};

const sanitizeName = (str) => {
    if (typeof str !== 'string') return '';
    let clean = str;
    // Remove invisible/control characters
    clean = clean.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F]/g, '');
    // Remove HTML/XML tags
    clean = clean.replace(/<[^>]*>/g, '');
    // Remove suspicious/XSS characters
    clean = clean.replace(/[\"'`={}\/|]/g, '');
    // Keep only letters, spaces, hyphens
    clean = clean.replace(/[^a-zA-Z\s-]/g, '');
    return clean;
};



// Utility to remove suspicious XSS characters from names
const removeSuspiciousChars = (str) => {
    if (typeof str !== 'string') return str;
    // Removes < > " ' / ` = { } | and other typical XSS vectors
    return str.replace(/[<>"'/`={}|]/g, '');
};

// --- Signup sanitization ---
const sanitizeSignup = [
    body('name')
        .customSanitizer(sanitizeName)
        .customSanitizer(removeInvisibleChars)
        .customSanitizer(removeSuspiciousChars)
        .trim()
        .escape() // escape HTML characters
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

// --- Login sanitization ---
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
