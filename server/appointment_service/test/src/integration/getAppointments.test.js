import { describe, it, beforeEach, afterEach } from 'mocha';
import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

describe('Appointment Service - Slot Retrieving Tests', function () {
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

    it('appointments must be retrieved by clinic', function (done) {
        const payload = JSON.stringify({
            clinicId: '5f50c31c1c9d440000a4a4a4',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CLINIC.RETRIEVE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CLINIC.RETRIEVE.REQUEST, payload);
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

    it('appointment retrieval by clinic should handle no appointments found', function (done) {
        const payload = JSON.stringify({
            clinicId: '6779737dec85725e49e1695f',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.CLINIC.RETRIEVE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.CLINIC.RETRIEVE.REQUEST, payload);
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

    it('appointment must be retrieved by dentist', function (done) {
        const payload = JSON.stringify({
            dentistId: '5f50c31c1c9d440000b4b4b1',
            startingDate: '2025-10-01',
            endingDate: '2025-10-31',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY.REQUEST, payload);
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

    it('appointment retrieval by dentist should handle missing fields', function (done) {
        const payload = JSON.stringify({
            dentistId: '5f50c31c1c9d440000b4b4b1',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.RETRIEVE.MANY.REQUEST, payload);
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

    it('appointment must be retrieved by id', function (done) {
        const payload = JSON.stringify({
            appointmentId: '676209f6c70d224bab0ed315',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE.REQUEST, payload);
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

    it('appointment retrieval by id should handle appointment not found', function (done) {
        const payload = JSON.stringify({
            appointmentId: '677979b38ea713e6d71013b7',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.APPOINTMENT.RETRIEVE.ONE.REQUEST, payload);
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