import connectDB from './config/db.js'
import { connectMQTT } from 'shared-mqtt/mqttClient.js'
import { mqttRouter } from './routes/appointmentRouter.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_db'
const PORT = process.env.PORT || 3002;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'
const MQTT_OPTIONS = {
    clientId: 'appointmentService',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
}

const startService = async () => {
    try {
        await connectDB(MONGODB_URI);
        await connectMQTT(MQTT_URI, MQTT_OPTIONS);
        await mqttRouter();
        console.log(`Service is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the service:', error);
        process.exit(1);
    }
};

await startService();