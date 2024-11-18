import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'unavailable'],
        default: 'available',
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    dentistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dentist',
        required: true,
    },
});

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;