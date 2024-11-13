import mongoose from 'mongoose';

const availabilitySlot = new mongoose.Schema({
    dentistId: {
        type: String,
        required: true
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

const AvailabilitySlot = mongoose.model('Dentist', availabilitySlot);

export default AvailabilitySlot;