import { describe, it, beforeEach, afterEach } from 'mocha';
import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

describe('Clinic Service - Clinic Updating Tests', function () {
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

    it('a clinic must be updated', function (done) {
        const payload = JSON.stringify({
            _id: '64b8f9f1f1a4c8b1a1a1a1a8',
            name: 'Mölmö Dentist Clinic',
            phone: '+46703456780',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.UPDATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.UPDATE.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(200);
                expect(response.data.name).to.equal('Mölmö Dentist Clinic');
                expect(response.data.phone).to.equal('+46703456780');
                expect(response.data.email).to.equal('info@malmodentalcare.se');
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('should fail to update a clinic that does not exist', function (done) {
        const payload = JSON.stringify({
            _id: '677a8303669a3ee512e40b75',
            name: 'Mölmö Dentist Clinic',
            phone: '+46703456780',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.UPDATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.UPDATE.REQUEST, payload);
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

    it('should fail to update a clinic with invalid e-mail', function (done) {
        const payload = JSON.stringify({
            _id: '64b8f9f1f1a4c8b1a1a1a1a8',
            email: '.@@',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.UPDATE.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.UPDATE.REQUEST, payload);
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

/*     it('should add dentist to a existing clinic', function (done) {
        const payload = JSON.stringify({
            _id: '5f50c31c1c9d440000a2a2a2',
            dentistId: '677a86f6bc0bc8d554bb44c8',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.ADD_DENTIST.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.ADD_DENTIST.REQUEST, payload);
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

    it('should fail to add dentist to a clinic that does not exist', function (done) {
        const payload = JSON.stringify({
            _id: '677a8710dced8e3cc351afd0',
            dentistId: '677a8719c11fdb0e1b120f40',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.CLINIC.ADD_DENTIST.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.CLINIC.ADD_DENTIST.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(404);
                done();
            });

        } catch (error) {
            done(error);
        }
    }); */
  
});