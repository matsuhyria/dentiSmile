import connectDB from './config/db.js';
import mqttUtils from 'shared-mqtt';
import { initializeRoutes } from './routes/authRoutes.js';

const { connectMQTT } = mqttUtils;
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db';
const MQTT_URI = process.env.MQTT_URI;
const MQTT_OPTIONS = {
    clientId: 'authenticationService',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
}
//! Del later
console.log('Starting the service...');
console.log('MQTT_URI:', MQTT_URI);
console.log('MONGODB_URI:', MONGODB_URI);

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

await startService();