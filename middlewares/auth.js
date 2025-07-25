const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const dbConnection = require('../configurations'); // أو مساره الصحيح

const { readFileSync } = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError(401, 'Access denied. No token provided.'));
    }

    const token = authHeader.split(' ')[1];

    const keyPath = path.join(__dirname, '../configurations/private.key');  
    let secretKey;

    try {
        secretKey = readFileSync(keyPath, 'utf-8');
    } catch (err) {
        return next(createError(500, 'JWT secret key file not found'));
    }
// -------
 
dbConnection('blacklist', async (collection) => {
    try {
        const found = await collection.findOne({ token });
        if (found) {
            return next(createError(401, 'Token is blacklisted. Please login again.'));
        }

        // ✅ تحقق JWT
        try {
            const decoded = jwt.verify(token, secretKey);
            req._user_id = decoded._id;
            next();
        } catch (err) {
            return next(createError(401, 'Invalid or expired token.'));
        }

    } catch (err) {
        return next(createError(500, 'Error checking blacklist'));
    }
});
};
