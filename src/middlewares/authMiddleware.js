const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

const authMiddleware = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ErrorResponse("Token tidak tidak valid atau kadaluwarsa", 401, 108);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 
        next();
    } catch (err) {
        throw new ErrorResponse("Token tidak tidak valid atau kadaluwarsa", 401, 108);
    }
};

module.exports = authMiddleware;