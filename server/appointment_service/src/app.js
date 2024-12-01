import { publishAllSlots, handleBookingRequests } from './controllers/appointmentMqttController.js';
import connectDB from './config/db.js'
//import appointmentRouter from './routes/appointmentRouter.js'
import mqttUtils from 'shared-mqtt'

const { connectMQTT, disconnectMQTT, subscribe, publish } = mqttUtils

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const PORT = process.env.PORT || 5000
const MQTT_URI = process.env.MQTT_URI || 'ws://localhost:8080'
const MQTT_OPTIONS = {
    clientId: 'appointmentService',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
}

await connectDB(MONGODB_URI);

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

const setupMQTT = async () => {
    try {
        console.log('Starting MQTT connection...')
        await connectMQTT(MQTT_URI, MQTT_OPTIONS)

        // Subscribe to booking requests and set up the handler
        await handleBookingRequests();

        // Start polling for updates
        pollDatabaseAndPublish();

    } catch (error) {
        console.error('Error initializing MQTT:', error);
        await subscribe('test', (message) => {
            console.log('Message received on /test', message)
        })
    }
}

await setupMQTT()

console.log(`Server running on port ${PORT}`);
