import request from 'supertest';
import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';

import AppointmentSlot from '../../../src/models/appointmentSlot.js';
import app from '../../../src/app.js';

describe('POST /api/v1/appointments', () => {
    // Helper to clean up the database before/after tests
    beforeEach(async () => {
        await AppointmentSlot.deleteMany({});
    });

    // Test case 1: Successful request with valid data
    it('should create appointment slots successfully', async () => {
        const requestBody = {
            dentistId: '12345',
            startTime: '2024-11-15T08:00:00Z',
            endTime: '2024-11-15T09:00:00Z',
            minutes: 60
        };

        const res = await request(app)
            .post('/api/v1/appointments')
            .send(requestBody)
            .expect(200);

        expect(res.body.message).to.equal('Appointment slots published successfully');

        // Verify that slots have been inserted into the database
        const slots = await AppointmentSlot.find({ dentistId: '12345' });
        expect(slots).to.have.length.above(0); // At least one slot should exist
    });

    // Test case 2: Missing startTime or endTime
    it('should return an error if startTime or endTime is missing', async () => {
        const requestBody = {
            dentistId: '12345',
            startTime: '2024-11-15T08:00:00Z'
        };

        const res = await request(app)
            .post('/api/v1/appointments')
            .send(requestBody)
            .expect(400);

        expect(res.body.message).to.equal('Dates cannot be null');
    });

    // Test case 3: Dates in the past
    it('should return an error if startTime or endTime is in the past', async () => {
        const requestBody = {
            dentistId: '12345',
            startTime: '2020-11-15T08:00:00Z',
            endTime: '2020-11-15T09:00:00Z',
            minutes: 60
        };

        const res = await request(app)
            .post('/api/v1/appointments')
            .send(requestBody)
            .expect(400);

        expect(res.body.message).to.equal('Dates cannot be in the past');
    });

    // Test case 4: Overlapping slots
    it('should return an error if there is an overlap with existing slots', async () => {
        // Pre-insert an existing appointment slot for the same dentist
        const existingSlot = new AppointmentSlot({
            dentistId: '12345',
            startTime: '2024-11-15T08:00:00Z',
            endTime: '2024-11-15T09:00:00Z'
        });
        await existingSlot.save();

        const requestBody = {
            dentistId: '12345',
            startTime: '2024-11-15T08:30:00Z', // This overlaps with the existing slot
            endTime: '2024-11-15T09:30:00Z',
            minutes: 30
        };

        const res = await request(app)
            .post('/api/v1/appointments')
            .send(requestBody)
            .expect(400);

        expect(res.body.message).to.equal('Slots for this timeframe already exist');
    });

    // Test case 5: Invalid date format
    it('should return an error if startTime or endTime has an invalid format', async () => {
        const requestBody = {
            dentistId: '12345',
            startTime: 'invalid-date',
            endTime: '2024-11-15T09:00:00Z',
            minutes: 60
        };

        const res = await request(app)
            .post('/api/v1/appointments')
            .send(requestBody)
            .expect(400);

        expect(res.body.message).to.equal('Invalid date format');
    });

    // Test case 6: Invalid dentistId (optional based on your validation logic)
    it('should return an error if dentistId is invalid or missing (optional check)', async () => {
        const requestBody = {
            dentistId: 'invalid-id',
            startTime: '2024-11-15T08:00:00Z',
            endTime: '2024-11-15T09:00:00Z',
            minutes: 60
        };

        const res = await request(app)
            .post('/api/v1/appointments')
            .send(requestBody)
            .expect(400);

        expect(res.body.message).to.equal('Invalid dentist ID');
    });
});