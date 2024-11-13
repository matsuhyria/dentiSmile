import bcrypt from 'bcrypt';
import Dentist from '../models/dentist.js';

const register = async (req, res) => {
    const { username, password, phone, location, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDentist = new Dentist({
            username,
            password: hashedPassword,
            phone,
            location,
            email
        });

        await newDentist.save();
        res.status(201).json({ message: 'Dentist registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering dentist' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const dentist = await Dentist.find({ username });
        if (!dentist || !(await bcrypt.compare(password, dentist.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // TO-DO add token generation
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

export { register, login };