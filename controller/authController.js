const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { User } = require('../modal/User');
const { readFileSync } = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const dbConnection = require('../configurations'); // أو المسار المناسب لموديول الاتصال بقاعدة البيانات


const privateKeyPath = path.resolve(__dirname, '../configurations/private.key');
const privateKey = readFileSync(privateKeyPath, 'utf-8');

// ----------------- Signup ---------------------
const signup = (req, res, next) => {
    const userData = req.body;

    // Validation
    const validation = User.validate(userData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    const user = new User(userData);

    // Check if user exists
    user.isExist()
        .then(result => {
            if (result.check) {
                return next(createError(409, result.message));
            }

            // Insert new user
            user.save((status) => {
                if (status.status) {
                    res.status(201).json({ message: 'User created successfully' });
                } else {
                    return next(createError(500, status.message));
                }
            });
        })
        .catch(err => {
            return next(createError(500, err.message));
        });
};

// ----------------- Login ---------------------
const login = (req, res, next) => {
    User.login(req.body)
        .then(result => {
            if (result.status) {
                const token = jwt.sign(
                    {
                        _id: result.data._id,
                        // _reviewer_id: result.data.reviewer?._id || null
                    },
                    privateKey,
                    { algorithm: 'HS256' }
                );
                return res.json({ token });
            }

            next(createError(401, result.message));
        })
        .catch(err => {
            next(createError(500, err.message));
        });
};
// ----------------- LogOut ---------------------
// authController.js
const logout = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError(400, 'No token provided'));
    }

    const token = authHeader.split(' ')[1];

    User.logout(token)
    .then(result => {
        if(result.status){
            return res.json({ message: 'Logged out successfully' });
        } else {
            next(createError(500, result.message));
        }
    })
    .catch(err => next(createError(500, err.message)));
}

module.exports = { signup, login,logout };
