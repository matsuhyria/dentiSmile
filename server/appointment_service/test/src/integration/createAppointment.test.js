import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

describe('Appointment Service Integration Tests', function () {
    let client;
    let clientId;

    beforeEach(function (done) {
        clientId = uuidv4();
        client = connect(MQTT_URI);
        client.on('connect', () => {
            done();
        });
        client.on('error', (err) => {
            done(err);
        });
    });

    afterEach(function (done) {
        client.end(true, () => {
            done();
        }
        );
    });

    it('appointment slot should be created', function (done) {
        /*      const currentDate = new Date();
                currentDate.setMinutes(0, 0, 0);
        
                const startTime = currentDate.toISOString().slice(0, 19) + 'Z';
                const endTime = new Date(currentDate.setHours(currentDate.getHours() + 1)).toISOString().slice(0, 19) + 'Z';
         */
        const startTime = '2028-01-01T09:00:00Z';
        const endTime = '2028-01-01T10:00:00Z';
        // Mock appointment data
        // Currently system does not check if the clinic or the dentist exists, but their ids must follow objectId syntax
        const payload = JSON.stringify({
            clinicName: 'Test Clinic',
            clinicId: '67619778b667d5764c97c9a5',
            dentistId: '6761978068db32cb79a77db6',
            startTime: startTime,
            endTime: endTime,
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(200);
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('appointment slot should not be created if it already exists', function (done) {
        const startTime = '2028-01-01T09:00:00Z';
        const endTime = '2028-01-01T10:00:00Z';
        
        const payload = JSON.stringify({
            clinicName: 'Test Clinic',
            clinicId: '67619778b667d5764c97c9a5',
            dentistId: '6761978068db32cb79a77db6',
            startTime: startTime,
            endTime: endTime,
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(400);
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('appointment slot should not be created if start time is in the past', function (done) {
        const startTime = '2020-01-01T09:00:00Z';
        const endTime = '2020-01-01T10:00:00Z';

        const payload = JSON.stringify({
            clinicName: 'Test Clinic',
            clinicId: '67619778b667d5764c97c9a5',
            dentistId: '6761978068db32cb79a77db6',
            startTime: startTime,
            endTime: endTime,
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(400);
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('appointment slot should not be created if end time is before start time', function (done) {
        const startTime = '2029-01-01T10:00:00Z';
        const endTime = '2029-01-01T09:00:00Z';

        const payload = JSON.stringify({
            clinicName: 'Test Clinic',
            clinicId: '67619778b667d5764c97c9a5',
            dentistId: '6761978068db32cb79a77db6',
            startTime: startTime,
            endTime: endTime,
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(400);
                done();
            });

        } catch (error) {
            done(error);
        }
    });



});