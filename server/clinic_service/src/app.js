import connectDB from './config/db.js';
import mqttUtils from 'shared-mqtt';
import { initializeRoutes } from './routes/clinicRoutes.js';
import { MQTT_TOPICS } from 'shared-mqtt/mqttTopics.js';

const { connectMQTT, publish, subscribe } = mqttUtils;
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://max:1234@dentistappointment.s95us.mongodb.net/?retryWrites=true&w=majority&appName=DentistAppointment";
const MQTT_URI = process.env.MQTT_URI || "ws://localhost:8080";
const MQTT_OPTIONS = {
    clientId: 'clinic_service',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
}

const startService = async () => {
    try {
        await connectDB(MONGODB_URI);
        await connectMQTT(MQTT_URI, MQTT_OPTIONS);
        await initializeRoutes();
        console.log(`Service is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the service:', error);
        process.exit(1);
    }
};

const test = async () => {
    const clientId = 12300321;
    const message = {
        name: 'Smily Smiles',
        address: '123 Smile St.',
        phone: '123-456-7890',
        email: '123',
        latitude: 40.7128,
        longitude: -74.0060,
        clientId: clientId,
        newEmail: '1223@1213'
    };

    try {
        await subscribe(MQTT_TOPICS.CLINIC.CREATE.RESPONSE(clientId), console.log);
        await publish(MQTT_TOPICS.CLINIC.CREATE.REQUEST, message);

        // UPDATE:
        await subscribe(MQTT_TOPICS.CLINIC.UPDATE.RESPONSE(clientId), console.log);
        await publish(MQTT_TOPICS.CLINIC.UPDATE.REQUEST, message);
    } catch (error) {
        console.error('Error during test clinic/create');
    }
}

await startService();
test();