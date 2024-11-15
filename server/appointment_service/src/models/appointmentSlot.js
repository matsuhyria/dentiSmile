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
        enum: ['not_available', 'available', 'booked', 'canceled'],
        default: 'not_available'
    }
});

const AppointmentSlot = mongoose.model('AppointmentSlot', appointmentSlot);

export default AppointmentSlot;