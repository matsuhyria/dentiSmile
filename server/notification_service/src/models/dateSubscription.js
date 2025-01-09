import mongoose from 'mongoose'

const dateSubscription = new mongoose.Schema({
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    patientId: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }]
})

const DateSubscription = mongoose.model('subscriptions', dateSubscription)

export default DateSubscription
