import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret_password';
const TOKEN_EXPIRES_IN = '1h';
const ROLES = {
    PATIENT: 'patient',
    DENTIST: 'dentist'
}

export const generateToken = (payload) => {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

export const verifyToken = (token) => {
    try {
        if (!token) {
            return { status: { code: 401, message: 'No token provided' } };
        }

        const decoded = jwt.verify(token, TOKEN_SECRET);
        return { status: { code: 200, message: 'Valid token' }, user: decoded };
    } catch (error) {
        console.error('Error verifying token', error);
        return { status: { code: 401, message: 'Invalid token' } };
    }
};

export const authorize = (handler, requiredRole) => async (message) => {
    try {
        const { token } = JSON.parse(message);

        const validationResult = verifyToken(token);
        if (validationResult.status.code !== 200) {
            return validationResult;
        }

        const user = validationResult.user;

        if (requiredRole && user.role !== requiredRole) {
            return { status: { code: 403, message: 'Access forbidden: Insufficient role' } };
        }

        return await handler(message, user);
    } catch (error) {
        console.error('Error in authorize wrapper:', error.message);
        return { status: { code: 500, message: 'Server error' } };
    }
};