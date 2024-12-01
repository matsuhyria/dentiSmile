import AppointmentSlot from '../models/appointmentSlot.js';
import { publish, subscribe } from '../../../../mqtt/mqtt.js';

const SLOT_TOPIC = 'appointment/slots';
const BOOKING_TOPIC = 'appointment/book';

// Publish all available appointment slots
export const publishAllSlots = async (mqttClient) => {
    try {

        await subscribe(mqttClient, SLOT_TOPIC, (message) => {
            console.log('Message received on', SLOT_TOPIC, message);
        });
        // Fetch all available appointment slots
        const slots = await AppointmentSlot.find();

        if (slots.length === 0) {
            console.log('No available slots to publish');
            return;
        }

        // Publish slots to the MQTT topic
        await publish(mqttClient, SLOT_TOPIC, JSON.stringify(slots));
        console.log(`Published ${slots.length} available appointment slots`);
    } catch (error) {
        console.error('Error publishing slots:', error);
    }
};

// Listen for booking requests and update the slot
export const handleBookingRequests = async (mqttClient) => {
    try {
        await subscribe(mqttClient, BOOKING_TOPIC, async (message) => {
            console.log('Booking message received:', message);

            const bookingRequest = JSON.parse(message);

            const { slotId, patientId } = bookingRequest;
            if (!slotId || !patientId) {
                console.error('Invalid booking request. Missing slotId or patientId.');
                return;
            }

            // Find and update the slot in the database
            const slot = await AppointmentSlot.findById(slotId);
            if (!slot) {
                console.error(`No slot found with ID: ${slotId}`);
                return;
            }

            if (slot.status === 'booked') {
                console.error(`Slot with ID: ${slotId} is already booked.`);
                return;
            }

            slot.status = 'booked';
            slot.patientId = patientId;
            await slot.save();

            console.log(`Slot with ID: ${slotId} successfully booked by patient: ${patientId}`);

            // Re-publish all updated slots
            const updatedSlots = await AppointmentSlot.find();
            await publish(mqttClient, SLOT_TOPIC, JSON.stringify(updatedSlots));
            console.log('Updated slots published to /appointment/slots');
        });

        console.log(`Subscribed to booking topic: ${BOOKING_TOPIC}`);
    } catch (error) {
        console.error('Error handling booking requests:', error);
    }
};