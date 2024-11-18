import express from 'express';
import Slot from '../models/SlotSchema.js';

const router = express.Router();

router.get('/v1/slots/available', async (req, res) => {
    try {
        const availableSlots = await Slot.find({ status: 'available' });
        res.json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/v1/slots/:id/book', async (req, res) => {
    const { patientId } = req.body;

    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        if (slot.status !== 'available') {
            return res.status(400).json({ message: 'Slot is not available' });
        }

        slot.status = 'booked';
        slot.patientId = patientId;
        await slot.save();

        res.json({ message: 'Slot booked successfully', slot });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/v1', (req, res) => {
    res.status(200).json({ message: 'Welcome to DentiSmile+ API v1!' });
});


export default router;
