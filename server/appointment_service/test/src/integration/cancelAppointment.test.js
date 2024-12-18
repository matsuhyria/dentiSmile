import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

/*
Note that hard coded objectIDs needs to be changed as mongodb is not seeded by mock data yet
After seeding is handled, I will update the ids  
*/


describe('Appointment Service - Slot Booking Tests', function () {
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

    it('appointment must be cancelled', function (done) {
        const payload = JSON.stringify({
            appointmentId: '676209f6c70d224bab0ed321',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CANCEL.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CANCEL.REQUEST, payload);
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

    it('appointment must not be cancelled if it is already cancelled', function (done) {
        const payload = JSON.stringify({
            appointmentId: '676209f6c70d224bab0ed335',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CANCEL.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CANCEL.REQUEST, payload);
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

    it('appointment must not be cancelled if it does not exist', function (done) {
        const payload = JSON.stringify({
            appointmentId: '67622ab55ccac9a5f3f15f66',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CANCEL.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CANCEL.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(404);
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('appointment must be removed', function (done) {
        const payload = JSON.stringify({
            appointmentId: '676209f6c70d224bab0ed337',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.REMOVE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.REMOVE.REQUEST, payload);
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

    it('appointment must not be removed if it does not exist', function (done) {
        const payload = JSON.stringify({
            appointmentId: '67622cef1821515ee8618649',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.REMOVE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.REMOVE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(404);
                done();
            });

        } catch (error) {
            done(error);
        }
    });
});