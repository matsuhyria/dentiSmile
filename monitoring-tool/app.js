import express from 'express';
import { connectMQTT, subscribe } from '../shared/mqtt/mqttClient.js';

const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883';
const PORT = process.env.PORT || 3003;

const MQTT_OPTIONS = {
    clientId: 'monitoringTool',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
};

let metrics = {
    connectedClients: 0,
    disconnectedClients: 0
};

const app = express()

const updateMetrics = (topic, message) => {
}

const startTool = async () => {
    try {

        await connectMQTT(MQTT_URI ,MQTT_OPTIONS);

        await subscribe('$SYS/#', (message, topic) => {
            console.log(`Topic: ${topic}, Message: ${message}`);
            updateMetrics(topic, message);
        });

        console.log('Monitoring started: Listening to $SYS topics');

        app.listen(PORT, () => {
            console.log(`Monitoring service is running on port ${PORT}`);
        });
    
    } catch (error) {
        console.error('Error starting the monitoring service:', error);
        process.exit(1);
    }
};

startTool();
