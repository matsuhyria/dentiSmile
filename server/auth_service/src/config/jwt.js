import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret_password';
const TOKEN_EXPIRES_IN = '1h';

export const generateToken = (payload) => {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

export const verifyToken = (token) => {
    return jwt.verify(token, TOKEN_SECRET);
};

