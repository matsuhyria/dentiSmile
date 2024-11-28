import connectDB from './config/db.js';
import { connectMQTT } from '../../../shared/mqtt/mqtt.js';

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const MQTT_URI = process.env.MQTT_URI;
const MQTT_OPTIONS = {
    clientId: 'authenticationService',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
}

const startService = async () => {
    try {
        await connectDB(MONGODB_URI);
        await connectMQTT(MQTT_URI, MQTT_OPTIONS);
        console.log(`Service is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the service:', error);
        process.exit(1);
    }
};

startService();