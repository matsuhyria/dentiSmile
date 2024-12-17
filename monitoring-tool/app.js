import { connectMQTT, subscribe } from '../shared/mqtt/mqttClient.js';
import mongoose from 'mongoose';
import { MQTT_TOPICS } from '../shared/mqtt/mqttTopics.js';
import connectDB from './config/db.js';
import AppointmentSlot from '../server/appointment_service/src/models/appointmentSlot.js';



const MONGODB_URI = process.env.MONGODB_URI;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883';
const PORT = process.env.PORT || 3005;


const MQTT_OPTIONS = {
    clientId: 'monitoringTool',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
};

let metrics = {
    connectedClients: 0,
    dentistCreate: 0,
    searchingPatients: 0,
    registeredDentists: 0,

};

const topicsToMonitor = [
    '$SYS/broker/clients/active',
    '$SYS/broker/clients/connected',
    MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST,
    MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY,
    MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE

];

const fetchMetricsFromDB = async () => {
    try {
        const modelNames = mongoose.modelNames();
        console.log('Registered Model Names:', modelNames);

        const collection = mongoose.connection.db.collection('slots');
        const collectionInfo = await collection.countDocuments();
        console.log('Collection document count:', collectionInfo);
        
       
    } catch (error) {
        console.error('Detailed error in fetchMetricsFromDB:', error)
        throw error;
    }
};

const updateMetrics = (topic, message) => {
    const value = parseInt(message, 10);

    if (topic === '$SYS/broker/clients/connected'){
        metrics.connectedClients = value;
    } 
    if (topic === '$SYS/broker/clients/disconnected'){
        metrics.disconnectedClients = value;
    }
    if (topic === MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST){
        metrics.dentistCreate ++;
    }
    if (topic === MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY || topic === MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE){
        metrics.searchingPatients ++;
    }
}

const displayMetricsMenu = () => {
    // console.clear(); // Clear the terminal before displaying new data
    console.log('==== MQTT Broker Metrics ====');
    console.log(`Connected Users      : ${metrics.connectedClients}`);
    console.log(`Create appointment   : ${metrics.dentistCreate}`);
    console.log('=============================');
  };

const startTool = async () => {
    try {
        console.log(`Service is running on port ${PORT}`);
        await connectDB(MONGODB_URI);
        await connectMQTT(MQTT_URI ,MQTT_OPTIONS);
        fetchMetricsFromDB();
        
        // for (let topic of topicsToMonitor) {
        //     await subscribe(topic, (message) => {
        //         updateMetrics(topic, message); 
        //         displayMetricsMenu();
        //     });
            
        // }
    
    } catch (error) {
        console.error('Error starting the monitoring service:', error);
        process.exit(1);
    }
};

startTool();
