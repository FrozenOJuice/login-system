const prisma = require('../config/db');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await prisma.user.create({
            data: { name, email, password },
        })

        res.status(201).json({ message: "User created", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: "Signup failed", details: error.message });
    };
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  };


module.exports = { signup, login };