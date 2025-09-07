const prisma = require('../config/db');

// GET all users
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    };
};

// GET user by id
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        };
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    };
};

// CREATE user
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email, password, role },
        });
        res.status(201).json(user);
    } catch {
        console.error(error);
        res.status(500).json({ error: 'Could not create user' });
    };
};

// UPDATE user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email, password, role },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Could not update user '});
    };
};

// DELETE user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete user' });
    };
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
