const jwt = require('jsonwebtoken');
require('dotenv').config();

const optionalAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch(error) {
        req.user = null;
        next();
    }
};

module.exports = optionalAuth;