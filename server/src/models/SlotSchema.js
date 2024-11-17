const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    status: { type: String, enum: ["available", "booked", "reserved"], default: "available"},
    dentistId: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist", required: true},
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient"},
});

module.exports = mongoose.model("Slot", SlotSchema);