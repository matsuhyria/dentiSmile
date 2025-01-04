import { describe, it, beforeEach, afterEach } from 'mocha';
import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

describe('Appointment Service - Slot Removing Tests', function () {
    this.timeout(5000);
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
        });
    });

    it('appointment must be removed', function (done) {
        const payload = JSON.stringify({
            appointmentId: '676209f6c70d224bab0ed33e',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.DELETE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.DELETE.REQUEST, payload);
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

    it('appointment removal should handle appointment not found', function (done) {
        const payload = JSON.stringify({
            appointmentId: '67797ab5ec29e52091c6a3c3',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.DELETE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.DELETE.REQUEST, payload);
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