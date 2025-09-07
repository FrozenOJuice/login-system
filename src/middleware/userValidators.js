const { body, param } = require('express-validator');

const createUserValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
        .normalizeEmail()
        .isEmail().withMessage('Invalid email'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be user or admin'),
];

const updateUserValidator = [
    param('id').isInt().withMessage('User ID must be an integer'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
        .optional()
        .normalizeEmail()
        .isEmail().withMessage('Invalid email'),
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be user or admin'),
];

const userIdValidator = [
    param('id').isInt().withMessage('User ID must be an integer'),
];

module.exports = {
    createUserValidator,
    updateUserValidator,
    userIdValidator,
};