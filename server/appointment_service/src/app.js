import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import appointmentRouter from './routes/appointmentRouter.js';
import { connectMQTT, publish, subscribe, disconnectMQTT } from '../../../mqtt/mqtt.js';
import { publishAllSlots } from './controllers/appointmentMqttController.js';


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const PORT = process.env.PORT || 5000;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883';
const MQTT_OPTIONS = { clientId: 'appointmentService' };

let mqttClient;

connectDB(MONGODB_URI);

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.options('*', cors());
app.use(cors());

const pollDatabaseAndPublish = async (mqttClient, interval = 5000) => {
    try {
        setInterval(async () => {
            console.log('Polling database for changes...');
            await publishAllSlots(mqttClient);
        }, interval); // Check database every 5 seconds
    } catch (error) {
        console.error('Error polling database:', error);
    }
};

const setupMQTT = async () => {
    try {
        console.log('Starting MQTT connection...');
        mqttClient = await connectMQTT(MQTT_URI, MQTT_OPTIONS);

        // Initial publish
        await publishAllSlots(mqttClient);

        // Start polling for updates
        pollDatabaseAndPublish(mqttClient);

    } catch (error) {
        console.error('Error initializing MQTT:', error);
    }
};

setupMQTT();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;