import User from '../models/user.js';
import { generateToken } from '../config/jwt.js';


export const register = async (message) => {
    try {
        const { email, password, role } = JSON.parse(message);
        // to restrict dentists from registering
        if (role !== 'patient') {
            return JSON.stringify({ success: false, message: 'Invalid role' });
        }

        const user = await User.findOne({ email });
        if (user) {
            return JSON.stringify({ success: false, message: 'Invalid credentials' });
        }

        const newUser = new User({ email, password, role });
        // password encryption is handled by mongoose
        await newUser.save();

        const token = generateToken({ id: newUser._id, role });

        return JSON.stringify({
            success: true,
            message: 'Patient registered successfully',
            token
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return JSON.stringify({ success: false, message: 'Error during register' });
    }
};

export const login = async (message) => {
    try {
        const { email, password } = JSON.parse(message);

        const user = await User.findOne({ email });
        if (!user) {
            return JSON.stringify({ success: false, message: 'Invalid credentials' });
        }

        const isValidPassword = await user.matchPassword(password);
        if (!isValidPassword) {
            return JSON.stringify({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken({ id: user._id, role: user.role });

        return JSON.stringify({
            success: true,
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return JSON.stringify({ success: false, message: 'Error during login' });
    }
};