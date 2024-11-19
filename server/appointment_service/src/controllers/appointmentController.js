const bookAppointment =  async (req, res) => {
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
};

export { createAppointments, bookAppointment };