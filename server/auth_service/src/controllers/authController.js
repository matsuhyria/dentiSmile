import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const register = async (message) => {
    try {
        const { email, password } = JSON.parse(message);

        const userExists = await User.findOne({ email });
        if (userExists) {
            return JSON.stringify({ success: false, message: 'User already exists' })
        }

        const newUser = new User({ email, password });
        await newUser.save();

        return JSON.stringify({ success: true, message: 'User registered successfully' })
    } catch (error) {
        console.error('Error registering user:', error);
        return JSON.stringify({ success: false, message: 'Error registering user' })
    }
};