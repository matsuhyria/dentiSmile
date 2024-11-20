import Dentist from '../models/dentist.js';

const retrieveAllDentists = async (req, res) => {
    try {
        const dentists = await Dentist.find();
        res.status(201).json(dentists);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error getting dentists' });
    }
};

const retrieveDentist = async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.params.id);
        const dentist = await Dentist.findById(req.params.id);
        if (!dentist) {
            return res.status(404).json({ message: 'Dentist not found' });
        }
        res.status(201).json(dentist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error retrieving dentist' });
    }
};

export { retrieveAllDentists, retrieveDentist };