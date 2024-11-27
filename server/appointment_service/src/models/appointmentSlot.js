import mongoose from 'mongoose';

const appointmentSlot = new mongoose.Schema({
    dentistId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
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

const AppointmentSlot = mongoose.model('AppointmentSlot', appointmentSlot);

export default AppointmentSlot;