import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
});

const Clinic = mongoose.model('clinic', clinicSchema);

export default Clinic;