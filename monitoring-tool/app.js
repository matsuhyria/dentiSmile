import { connectMQTT, subscribe } from '../shared/mqtt/mqttClient.js';
import mongoose from 'mongoose';
import { MQTT_TOPICS } from '../shared/mqtt/mqttTopics.js';
import connectDB from './config/db.js';
import EventEmitter from 'events';

const metricsEmitter = new EventEmitter();

class MonitoringTool {
    constructor() {
        this.metrics = {
            activeClients: 0,
            dentistCreate: 0,
            searchingPatients: 0,
            registeredDentists: 0,
            availableAppointments: 0
        };

        this.topicsToMonitor = [
            '$SYS/broker/clients/active',
            MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST,
            MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY.REQUEST,
            MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE.REQUEST
        ];

        metricsEmitter.on('metricsUpdated', this.displayMetricsMenu.bind(this));
    }

    async fetchDentistMetrics() {
        try {
            const collectionDentists = mongoose.connection.db.collection('dentist');
            this.metrics.registeredDentists = await collectionDentists.countDocuments();
            metricsEmitter.emit('metricsUpdated');
        } catch (error) {
            console.error('Error fetching dentist metrics:', error);
        }
    }

    async fetchSlotMetrics() {
        try {
            const collectionSlots = mongoose.connection.db.collection('slots');
            this.metrics.availableAppointments = await collectionSlots.countDocuments({status: 'available'});
            metricsEmitter.emit('metricsUpdated');
        } catch (error) {
            console.error('Error fetching slot metrics:', error);
        }
    }

    updateMetrics(topic, message) {
        const value = parseInt(message, 10);

        switch(topic) {
            case '$SYS/broker/clients/active':
                this.metrics.activeClients = value;
                break;
            case MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST:
                this.metrics.dentistCreate++;
                break;
            case MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY.REQUEST:
            case MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE.REQUEST:
                this.metrics.searchingPatients++;
                break;
        }

        metricsEmitter.emit('metricsUpdated');
    }

    displayMetricsMenu() {
        console.clear();
        console.log('==== MQTT Broker Metrics ====');
        console.log(`Active users                           : ${this.metrics.activeClients}`);
        console.log(`Dentists publishing new appointments   : ${this.metrics.dentistCreate}`);
        console.log(`Searching patients                     : ${this.metrics.searchingPatients}`);
        console.log(`Registered dentists                    : ${this.metrics.registeredDentists}`);
        console.log(`Available appointments                 : ${this.metrics.availableAppointments}`);
        console.log('=============================');
    }

    async start(mongoUri, mqttUri, port) {
        try {
            console.log(`Service is running on port ${port}`);
            await connectDB(mongoUri);
            await connectMQTT(mqttUri, {
                clientId: 'monitoringTool',
                reconnectPeriod: 2000,
                connectTimeout: 30 * 1000,
                clean: true
            });

            // fetch metrics upon the initialization of the tool
            await this.fetchDentistMetrics();
            await this.fetchSlotMetrics();

            for (const topic of this.topicsToMonitor) {
                await subscribe(topic, (message) => {
                    this.updateMetrics(topic, message);
                });
            }

            // database refresh
            setInterval(() => {
                this.fetchDentistMetrics();
                this.fetchSlotMetrics();
            }, 30000);

            // menu update
            setInterval(() => {
                metricsEmitter.emit('metricsUpdated');
            }, 2000);

        } catch (error) {
            console.error('Error starting the monitoring service:', error);
            process.exit(1);
        }
    }
}

const monitoringTool = new MonitoringTool();
monitoringTool.start(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_db',
    process.env.MQTT_URI || 'mqtt://localhost:1883', 
    process.env.PORT || 3005
);