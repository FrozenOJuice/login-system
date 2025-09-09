// middleware/sanitizeInput.js
const { body } = require('express-validator');

// --- Utility functions ---
const removeInvisibleChars = (str) =>
    typeof str === 'string' ? str.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F]/g, '') : '';

const removeHTMLTags = (str) =>
    typeof str === 'string' ? str.replace(/<[^>]*>/g, '') : '';

const removeSuspiciousChars = (str) => {
    if (typeof str !== 'string') return '';
    // remove <, >, ", ', `, =, {, }, /, |
    return str.replace(/[<>\"'`={}\/|]/g, '');
};
    
// --- Name sanitizer ---
const sanitizeName = (str) => {
    if (typeof str !== 'string') return '';
    let clean = str;
    clean = removeInvisibleChars(clean);
    clean = removeHTMLTags(clean);
    clean = removeSuspiciousChars(clean);
    // Keep only letters, spaces, and hyphens
    clean = clean.replace(/[^a-zA-Z\s-]/g, '');
    return clean.trim();
};

// --- Email sanitizer ---
const sanitizeEmail = (str) => {
    if (typeof str !== 'string') return '';
    let clean = str;
    clean = removeInvisibleChars(clean);
    clean = removeSuspiciousChars(clean);
    clean = clean.trim().toLowerCase();
    return clean;
};

// --- Password sanitizer ---
const sanitizePassword = (str) => {
    if (typeof str !== 'string') return '';
    return removeInvisibleChars(str).trim();
};

// --- Signup sanitization middleware ---
const sanitizeSignup = [
    body('name').customSanitizer(sanitizeName),
    body('email').customSanitizer(sanitizeEmail),
    body('password').customSanitizer(sanitizePassword),
    (req, res, next) => next(), // continue to validation or controller
];

// --- Login sanitization middleware ---
const sanitizeLogin = [
    body('email').customSanitizer(sanitizeEmail),
    body('password').customSanitizer(sanitizePassword),
    (req, res, next) => next(),
];

module.exports = {
    sanitizeSignup,
    sanitizeLogin,
};
