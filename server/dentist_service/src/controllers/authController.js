import bcrypt from 'bcrypt';
import Dentist from '../models/dentist.js';

const register = async (req, res) => {
    const { username, password, first_name, surname, phone, location, latitude, longitude, street, city, zip, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDentist = new Dentist({
            username,
            password: hashedPassword,
            first_name,
            surname,
            phone,
            location,
            latitude,
            longitude,
            street,
            city,
            zip,
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
        const dentist = await Dentist.findOne({ username });
        if (!dentist) return res.status(404).json({ message: 'Dentist not found' });

        const isMatch = await bcrypt.compare(password, dentist.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // TO-DO add token generation
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

export { register, login };