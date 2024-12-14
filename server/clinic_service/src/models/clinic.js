import mongoose from 'mongoose'

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: [Number],
        required: true,
        validate: {
            validator: function (value) {
                return value.length === 2
            },
            message:
                'Position must be an array of two numbers [latitude, longitude]'
        }
    },
    address: new mongoose.Schema({
        line1: {
            type: String,
            required: true
        },
        line2: {
            type: String
        }
    }),
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
    },
    dentists: {
        type: [String]
    }
})

const Clinic = mongoose.model('clinic', clinicSchema)

export default Clinic
