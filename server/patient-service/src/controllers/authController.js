import Patient from '../models/patient.js';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
    const { username, password, phone, email, age } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newPatient = new Patient({
            username,
            password: hashedPassword,
            phone,
            age,
            email
        });

        await newPatient.save();
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering patient' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const patient = await Patient.findOne({ username });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // TO-DO add token generation
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error logging in' });
    }
};

export { register, login };
