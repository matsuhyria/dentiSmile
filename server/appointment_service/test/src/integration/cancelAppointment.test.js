import { describe, it, beforeEach, afterEach } from 'mocha';
import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

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

    it('appointment must be retrieved', function (done) {
        const payload = JSON.stringify({
            clinicId: '67619778b667d5764c97c9a5',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.GET_BY_CLINIC.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.GET_BY_CLINIC.REQUEST, payload);
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
});