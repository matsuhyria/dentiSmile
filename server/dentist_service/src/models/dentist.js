import mongoose from 'mongoose';

const dentistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
});

const Dentist = mongoose.model('Dentist', dentistSchema);

export default Dentist;