import User from '../models/user.js';
import { generateToken } from '../config/jwt.js';


export const register = async (message) => {
    try {
        const { email, password, role } = JSON.parse(message);

        if (!email || !password || !role) {
            return { status: { code: 400, message: 'Missing fields' } };
        }

        // to restrict dentists from registering
        if (role !== 'patient') {
            return { status: { code: 403, message: 'Invalid role' } };
        }

        const user = await User.findOne({ email });
        if (user) {
            return { status: { code: 400, message: 'User already exists' } };
        }

        const newUser = new User({ email, password, role });
        // password encryption is handled by mongoose
        await newUser.save();

        const token = generateToken({ id: newUser._id, role });

        return { status: { code: 200, message: 'User registered successfully' }, token };
    } catch (error) {
        console.error('Error registering user:', error);
        return { status: { code: 500, message: 'Error during register' } };
    }
};

export const login = async (message) => {
    try {
        const { email, password } = JSON.parse(message);

        if (!email || !password) {
            return { status: { code: 400, message: 'Missing fields' } };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { status: { code: 404, message: 'User not found' } };
        }

        const isValidPassword = await user.matchPassword(password);
        if (!isValidPassword) {
            return { status: { code: 400, message: 'Invalid credentials' } };
        }

        const token = generateToken({ id: user._id, role: user.role });

        return { status: { code: 200, message: 'Login successful' }, token };
    } catch (error) {
        console.error('Error logging in user:', error);
        return { status: { code: 500, message: 'Error during login' } };
    }
};