import express from 'express';
import { connectMQTT, subscribe } from '../shared/mqtt/mqttClient.js';
import { MQTT_TOPICS } from '../shared/mqtt/mqttTopics.js';

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
    disconnectedClients: 0,
    messagesSent: 0,
    messagesReceived: 0,
    counter: 0
};

const topicsToMonitor = [
    '$SYS/broker/clients/active',
    '$SYS/broker/clients/connected',
    '$SYS/broker/clients/disconnected',
    '$SYS/broker/messages/sent',
    '$SYS/broker/messages/received',
    'appointment/create'
];

const app = express()

const updateMetrics = (topic, message) => {
    const value = parseInt(message, 10);

    if (topic === '$SYS/broker/clients/connected'){
        metrics.connectedClients = value;
    } 
    if (topic === '$SYS/broker/clients/disconnected'){
        metrics.disconnectedClients = value;
    } 
    if (topic === '$SYS/broker/messages/sent') {
        metrics.messagesSent = value;
    }
    if (topic === '$SYS/broker/messages/received') {
        metrics.messagesReceived = value;
    }
    if (topic === MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST){
        metrics.counter ++;
    }
}

const displayMetricsMenu = () => {
    // console.clear(); // Clear the terminal before displaying new data
    console.log('==== MQTT Broker Metrics ====');
    console.log(`Connected Clients    : ${metrics.connectedClients}`);
    console.log(`Disconnected Clients : ${metrics.disconnectedClients}`);
    console.log(`Messages Sent        : ${metrics.messagesSent}`);
    console.log(`Messages Received    : ${metrics.messagesReceived}`);
    console.log(`Create appointment   : ${metrics.counter}`);
    console.log('=============================');
  };

const startTool = async () => {
    try {

        await connectMQTT(MQTT_URI ,MQTT_OPTIONS);

        for (let topic of topicsToMonitor) {
            await subscribe(topic, (message) => {
                updateMetrics(topic, message); 
                displayMetricsMenu();
            });
            
        }

        app.listen(PORT, () => {
            console.log(`Monitoring service is running on port ${PORT}`);
        });
    
    } catch (error) {
        console.error('Error starting the monitoring service:', error);
    }
};

startTool();
