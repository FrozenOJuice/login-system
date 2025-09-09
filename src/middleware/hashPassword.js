
const bcrypt = require('bcrypt');
​
const hashPassword = async (req, res, next) => {
    try {
        if (!req.body.password) {
            return next();
        }
        if (!req.user || req.body.password !== req.user.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hashedPassword;
        }
        next();
    } catch (err) {
        next(err);
    }
};
​
module.exports = hashPassword;
