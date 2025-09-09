const { sanitize } = require('express-validator');
const xss = require('xss');
const sqlstring = require('sqlstring');

/**
 * Middleware to sanitize incoming request data.
 * Strips dangerous HTML (XSS) and reduces SQL injection risk.
 */
const sanitizeInput = (req, res, next) => {
    try {
        const sanitizeValue = (value) => {
            if (typeof value === 'string') {
                // Clean HTML/JS (XSS protection)
                let clean = xss(value);

                // Escape SQL special characters
                clean = sqlstring.escape(clean);

                // Remove wrapping quotes added by sqlstring.escape()
                if (clean.startsWith("'") && clean.endsWith("'")) {
                    clean = clean.slice(1, -1);
                }

                return clean.trim();
            }
            return value;
        };

        // Loop over request body, query, and params
        ['body', 'query', 'params'].forEach((key) => {
            if (req[key]) {
                Object.keys(req[key]).forEach((field) => {
                    req[key][field] = sanitizeValue(req[key][field]);
                });
            }
        });

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = sanitizeInput;
