import { describe, it, beforeEach, afterEach } from 'mocha';
import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

describe('Clinic Service - Clinic Removal Tests', function () {
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

    it('should remove a clinic', function (done) {
        const payload = JSON.stringify({
            _id: '64b8f9f1f1a4c8b1a1a1a1b5',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.REMOVE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.REMOVE.REQUEST, payload);
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

    it('should fail to remove a clinic that does not exist', function (done) {
        const payload = JSON.stringify({
            _id: '677a86884a526e33d35d8e11',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.REMOVE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.REMOVE.REQUEST, payload);
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