const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const prisma = require('./src/config/db')

const app = express();
app.use(express.json());

const userRoutes = require('./src/routes/userRoute');
const authRoutes = require('./src/routes/authRoutes');

// Test Route
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// DB Test Route
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    };
});

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});