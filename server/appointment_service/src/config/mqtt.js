import mqttUtils from 'shared-mqtt'
const { connectMQTT, disconnectMQTT, subscribe, publish } = mqttUtils
import { publishAllSlots, handleBookingRequests } from '../controllers/appointmentMqttController.js';


const setupMQTT = async (MQTT_URI, MQTT_OPTIONS) => {
    try {
        console.log('Connecting to MQTT Broker...')
        await connectMQTT(MQTT_URI, MQTT_OPTIONS)

        // Subscribe to booking requests and set up the handler
        await handleBookingRequests();

        // Start polling for updates
        pollDatabaseAndPublish();

    } catch (error) {
        console.error('Error initializing MQTT', error)
    }
}

const pollDatabaseAndPublish = async (interval = 5000) => {
    try {
        setInterval(async () => {
            console.log('Polling database for changes...');
            await publishAllSlots();
        }, interval); // Check database every 5 seconds
    } catch (error) {
        console.error('Error polling database:', error);
    }
};



export default setupMQTT