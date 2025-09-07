const express = require('express');
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const validate = require('../middleware/validate');
const {
    createUserValidator,
    updateUserValidator,
    userIdValidator
} = require('../middleware/userValidators');

const router = express.Router();

// Routes
router.get('/', getUsers);
router.get('/:id', validate(userIdValidator), getUserById);
router.post('/', validate(createUserValidator), createUser);
router.put('/:id', validate(updateUserValidator), updateUser);
router.delete('/:id', validate(userIdValidator), deleteUser);

module.exports = router;