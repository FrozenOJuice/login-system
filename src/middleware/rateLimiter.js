const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        error: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // only 5 signups per hour per IP
    message: {
        status: 429,
        error: "Too many signup attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // only 10 login attempts per IP in 15 min
    message: {
        status: 429,
        error: "Too many login attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { generalLimiter, signupLimiter, loginLimiter };