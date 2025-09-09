const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoute = require('./src/routes/userRoute');
app.use('/api/users', userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});