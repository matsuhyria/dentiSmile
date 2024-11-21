import AppointmentSlot from '../models/appointmentSlot.js';
import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    //Subscribe to topics from client
    client.subscribe('appointment/book', { qos: 1 },(err) => {
        if (err) {
            console.error('Subscription failed:', err);
        } else {
            console.log('Successfully subscribed to appointments/booked');
        }
    });
    client.subscribe('appointments/details', { qos: 1 },(err) => {
        if (err) {
            console.error('Subscription failed:', err);
        } else {
            console.log('Successfully subscribed to appointments/booked');
        }
    });
    client.subscribe('appointments/all', { qos: 1 },(err) => {
        if (err) {
            console.error('Subscription failed:', err);
        } else {
            console.log('Successfully subscribed to appointments/booked');
        }
    });
});

//appointment/book
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

//appointments/details/{slotId}
const getSlotDetails = async (req, res) => {
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

//appointments/all
const getAllSlots = async (req, res) => {
    try {
        const slots = await AppointmentSlot.find();
        res.status(200).json({ slots });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
}

export { bookAppointment, getSlotDetails, getAllSlots };