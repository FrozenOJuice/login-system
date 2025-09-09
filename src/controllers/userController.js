const prisma = require('../config/db');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await prisma.user.create({
            data: { username, email, password },
        })

        res.status(201).json({ message: "User created", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: "Signup failed", details: error.message });
    };
};

const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await prisma.user.findUnique({
        where: { username },
      });
  
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Login failed", details: err.message });
    }
  };


module.exports = { signup, login };