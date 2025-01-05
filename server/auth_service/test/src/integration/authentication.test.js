import { describe, it, beforeEach, afterEach } from 'mocha';
import { connect } from 'mqtt';
import { expect } from 'chai';
import mqttUtils from 'shared-mqtt'
import { v4 as uuidv4 } from 'uuid';

const { MQTT_TOPICS } = mqttUtils;
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'

describe('Authentication Service Integration Tests', function () {
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

    it('should register a new user', function (done) {
        const payload = JSON.stringify({
            email: 'notadentist@gmail.com',
            password: 'password',
            role: 'patient',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.REGISTER.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.AUTHENTICATION.REGISTER.REQUEST, payload);
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

    it('should fail to register a user with existing mail', function (done) {
        const payload = JSON.stringify({
            email: 'notadentist@gmail.com',
            password: 'password',
            role: 'patient',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.REGISTER.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.AUTHENTICATION.REGISTER.REQUEST, payload);
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

    it('should fail to register a user with invalid role', function (done) {
        const payload = JSON.stringify({
            email: 'abcd@gmail.com',
            password: 'password',
            role: 'dentist',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.REGISTER.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.AUTHENTICATION.REGISTER.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(403);
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('should fail to register a user with invalid payload', function (done) {
        const payload = JSON.stringify({
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.REGISTER.RESPONSE(clientId), () => {    
                client.publish(MQTT_TOPICS.AUTHENTICATION.REGISTER.REQUEST, payload);
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

    it('should login a user', function (done) {
        const payload = JSON.stringify({
            email: 'notadentist@gmail.com',
            password: 'password',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.LOGIN.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.AUTHENTICATION.LOGIN.REQUEST, payload);
            });

            client.on('message', (topic, message) => {
                const response = JSON.parse(message.toString());
                expect(response.status.code).to.equal(200);
                expect(response.token).to.exist;
                expect(response.token).to.not.be.empty;
                done();
            });

        } catch (error) {
            done(error);
        }
    });

    it('should fail to login a user with invalid credentials', function (done) {
        const payload = JSON.stringify({
            email: 'notadentist@gmail.com',
            password: 'wrongpassword',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.LOGIN.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.AUTHENTICATION.LOGIN.REQUEST, payload);
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

    it('should fail to login a user that does not exist', function (done) {
        const payload = JSON.stringify({
            email: 'nonexistentuser@gmail.com',
            password: 'password',
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.LOGIN.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.AUTHENTICATION.LOGIN.REQUEST, payload);
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

    it('should fail to login a user with invalid payload', function (done) {
        const payload = JSON.stringify({
            clientId: clientId
        });

        try {
            client.subscribe(MQTT_TOPICS.AUTHENTICATION.LOGIN.RESPONSE(clientId), () => {
                client.publish(MQTT_TOPICS.AUTHENTICATION.LOGIN.REQUEST, payload);
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