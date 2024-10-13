const jwt = require('jsonwebtoken');
const User = require('./models/user');

const auth = (allowedRoles) => async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secretKey');
        const user = await User.findOne({ _id: decoded._id });

        if (!user || !allowedRoles.includes(user.role)) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send({ error: 'Not authorized to access this resource' });
    }
};
module.exports = auth;