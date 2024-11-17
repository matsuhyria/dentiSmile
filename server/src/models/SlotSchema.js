const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  status: { type: String, enum: ["available", "booked", "reserved"], default: "available" },
  dentistId: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }, // Optional, only after booking
});

module.exports = mongoose.model("Slot", slotSchema);
