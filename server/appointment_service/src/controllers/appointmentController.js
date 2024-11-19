import AppointmentSlot from '../models/appointmentSlot.js';

const bookAppointment = async (req, res) => {
    const { patientId } = req.body;

    try {
        const slot = await AppointmentSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Appointment slot not found' });
        }

        if (slot.status !== 'available') {
            return res.status(400).json({ message: 'Appointment slot is not available' });
        }

        slot.status = 'booked';
        slot.patientId = patientId;
        await slot.save();

        res.status(200).json({ message: 'Appointment slot booked successfully', slot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getSlotDetailt = async (req, res) => {
    try {
        const slot = await AppointmentSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        res.json(slot);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { bookAppointment, getSlotDetailt };