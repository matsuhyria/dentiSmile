import mongoose from 'mongoose';

const appointmentSlot = new mongoose.Schema({
    clinicName: {
        type: String,
        required: true
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
        enum: ['available', 'booked', 'locked', 'canceled'],
        default: 'available'
    }
});

const AppointmentSlot = mongoose.model('slots', appointmentSlot);

export default AppointmentSlot;
