import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.cookie('token', token, {
        httpOnly: true, // to prevent client side JS from reading the cookie and xss attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // to prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};

// Middleware to validate token and role
const authenticateRole = (requiredRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: 'Access denied: Token not provided' });
        }

        // Ensure the token is provided in "Bearer <token>" format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res
                .status(401)
                .json({ message: 'Access denied: Malformed authorization header' });
        }

        const token = parts[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Access denied: Token is missing' });
        }

        // Validate the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res
                        .status(401)
                        .json({ message: 'Access denied: Token expired' });
                }
                return res
                    .status(401)
                    .json({ message: 'Access denied: Invalid token' });
            }

            // Check if the user's role is allowed
            const userData = decodedToken;
            if (requiredRoles.includes(userData.role)) {
                req.user = userData; // Attach decoded token data to the request object
                next(); // Proceed to the next middleware or route handler
            } else {
                return res
                    .status(403)
                    .json({ message: 'Access forbidden: Insufficient permissions' });
            }
        });
    };
};

export { generateTokenAndSetCookie, authenticateRole };