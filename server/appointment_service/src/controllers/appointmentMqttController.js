import AppointmentSlot from '../models/appointmentSlot.js';
import { publish, subscribe } from '../../../mqtt/mqtt.js';

const SLOT_TOPIC = 'appointment/slots';

// Publish all available appointment slots
export const publishAllSlots = async (mqttClient) => {
    try {

        await subscribe(mqttClient, 'appointment/slots', (message) => {
            console.log('Message received on /appointment/slots', message);
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