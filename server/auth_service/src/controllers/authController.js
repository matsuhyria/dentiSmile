import User from '../models/user';
import { generateTokenAndSetCookie } from '../middleware/authMiddleware';

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            email,
            password,
        });

        await newUser.save();

        const token = generateTokenAndSetCookie(res, newUser);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: newUser._id, email: newUser.email },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering User' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateTokenAndSetCookie(res, user);

        res.json({
            token,
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error logging User' });
    }
};

export { register, login };
