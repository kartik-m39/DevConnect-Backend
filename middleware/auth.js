const jwt = require('jsonwebtoken');
const JWT_SECRET = "my_secret-key";

function checkForAuth(req, res, next) {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {
    checkForAuth, 
}