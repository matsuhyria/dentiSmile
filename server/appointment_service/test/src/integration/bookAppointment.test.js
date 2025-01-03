import { describe, it, beforeEach, afterEach } from 'mocha';
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

    it('appointment slot should be booked', function (done) {
        const payload = JSON.stringify({
            patientId: '6761b4a29a1b18382321d161',
            appointmentId: '676209f6c70d224bab0ed315',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.BOOK.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.BOOK.REQUEST, payload);
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

    it('appointment slot should not be booked in case it already is booked', function (done) {
        const payload = JSON.stringify({
            patientId: '6761b4a29a1b18382321d161',
            appointmentId: '676209f6c70d224bab0ed318',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.BOOK.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.BOOK.REQUEST, payload);
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

    it('appointment slot should not be booked in case it does not exist', function (done) {
        const payload = JSON.stringify({
            patientId: '6761b4a29a1b18382321d161',
            appointmentId: '6761e2ee8443994aad7fcf5d',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.BOOK.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.BOOK.REQUEST, payload);
            })

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(404);
                done();
            });
        } catch (error) {
            done(error);
        }
    });

    it('appointment slot should not be booked in case it was cancelled by dentist', function (done) {
        const payload = JSON.stringify({
            patientId: '6761b4a29a1b18382321d161',
            appointmentId: '676209f6c70d224bab0ed31b',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.BOOK.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.BOOK.REQUEST, payload);
            })

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