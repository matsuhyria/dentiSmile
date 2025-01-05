import { describe, it, beforeEach, afterEach } from 'mocha';
import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

describe('Clinic Service - Clinic Creation Tests', function () {
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

    it('clinic must be created', function (done) {
        const payload = JSON.stringify({
            name: 'Mr White Dental Clinic',
            address: { line1: 'For sure 1234 White St' },
            phone: '1234567890',
            email: 'mrwhitedental@denty.com',
            position: [12.345678, 98.765432],
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(200);
                expect(response.data.name).to.equal('Mr White Dental Clinic');
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('clinic must not be created with existing email', function (done) {
        const payload = JSON.stringify({
            name: 'Denty Dental Clinic',
            address: { line1: 'For sure 4321 White St' },
            phone: '0987654321',
            email: 'mrwhitedental@denty.com',
            position: [13.345678, 92.765432],
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(400);
                expect(response.status.message).to.equal('Clinic already exists');
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('clinic must not be created with invalid email', function (done) {
        const payload = JSON.stringify({
            name: 'Denty Dental Clinic',
            address: { line1: 'For sure 4321 White St' },
            phone: '0987654321',
            email: '.@Denty@.com@dental',
            position: [13.345678, 92.765432],
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(400);
                expect(response.status.message).to.equal('Invalid email format');
                done();
            });

        } catch (error) {
            done(error);
        }
    });

/*     it('clinic must not be created with invalid payload', function (done) {
        const payload = JSON.stringify({
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.CREATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.CREATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(400);
                done();
            });

        } catch (error) {
            done(error);
        }
    }); */


});