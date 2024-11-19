import mongoose from 'mongoose';

const appointmentSlot = new mongoose.Schema({
    dentistId: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        default: null
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'canceled'],
        default: 'available'
    }
});

const AppointmentSlot = mongoose.model('slots', appointmentSlot);

export default AppointmentSlot;