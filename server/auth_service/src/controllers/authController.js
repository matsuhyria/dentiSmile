import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const register = async (
    message,
    client,
    responseTopicForRegisteringANewUser
) => {
    try {
        const { email, password } = JSON.parse(message);

        const userExists = await User.findOne({ email });
        if (userExists) {
            client.publish(
                responseTopicForRegisteringANewUser,
                JSON.stringify({ success: false, message: 'User already exists' })
            );
            return;
        }

        const newUser = new User({ email, password });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        client.publish(
            responseTopicForRegisteringANewUser,
            JSON.stringify({
                success: true,
                message: 'User registered successfully',
                token,
            })
        );
    } catch (error) {
        console.error('Error registering user:', error);
        client.publish(
            responseTopicForRegisteringANewUser,
            JSON.stringify({ success: false, message: 'Error registering user' })
        );
    }
};

export const login = async (message, client, responseTopicForLoggingIn) => {
    try {
        const { email, password } = JSON.parse(message);

        if (!email || !password) {
            client.publish(
                responseTopicForLoggingIn,
                JSON.stringify({
                    success: false,
                    message: 'Email and password are required',
                })
            );
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            client.publish(
                responseTopicForLoggingIn,
                JSON.stringify({ success: false, message: 'Invalid credentials' })
            );
            return;
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            client.publish(
                responseTopicForLoggingIn,
                JSON.stringify({ success: false, message: 'Invalid credentials' })
            );
            return;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        client.publish(
            responseTopicForLoggingIn,
            JSON.stringify({
                success: true,
                message: 'Login successful',
                token,
            })
        );
    } catch (error) {
        console.error('Error logging in user:', error);
        client.publish(
            responseTopicForLoggingIn,
            JSON.stringify({ success: false, message: 'Error logging in user' })
        );
    }
};