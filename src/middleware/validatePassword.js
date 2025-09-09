// Requires: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
};

const validatePassword = (req, res, next) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            error:
                'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
        });
    }

    next();
};

module.exports = validatePassword;
