import { generateSlots, generateRepeatedTimeSlots, isValidIsoDate } from '../../../src/utils/dateUtils.js';
import { expect, assert } from 'chai';
import { describe, it } from 'mocha';

describe('generateSlots', () => {
    it('should generate hourly slots within the given range', function () {
        const dentistId = '123';
        const startDateISO = '2024-11-21T08:00:00Z';
        const endDateISO = '2024-11-21T12:00:00Z';
        const slots = generateSlots(dentistId, startDateISO, endDateISO, 60);

        const expectedSlots = [
            { dentistId: '123', startTime: '2024-11-21T08:00:00.000Z', endTime: '2024-11-21T09:00:00.000Z' },
            { dentistId: '123', startTime: '2024-11-21T09:00:00.000Z', endTime: '2024-11-21T10:00:00.000Z' },
            { dentistId: '123', startTime: '2024-11-21T10:00:00.000Z', endTime: '2024-11-21T11:00:00.000Z' },
            { dentistId: '123', startTime: '2024-11-21T11:00:00.000Z', endTime: '2024-11-21T12:00:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);
    });

    it('should generate 1-hour time slots between start and end dates', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T10:00:00Z';

        const slots = generateSlots(dentistId, startDateISO, endDateISO);

        expect(slots).to.have.lengthOf(2);

        expect(slots[0]).to.have.property('dentistId').that.equals(dentistId);
        expect(slots[0].startTime).to.equal('2024-11-15T08:00:00.000Z');
        expect(slots[0].endTime).to.equal('2024-11-15T09:00:00.000Z');

        expect(slots[1]).to.have.property('dentistId').that.equals(dentistId);
        expect(slots[1].startTime).to.equal('2024-11-15T09:00:00.000Z');
        expect(slots[1].endTime).to.equal('2024-11-15T10:00:00.000Z');
    });

    it('should generate 30-minute time slots', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T09:30:00Z';

        const slots = generateSlots(dentistId, startDateISO, endDateISO, 30);

        expect(slots).to.have.lengthOf(3);

        expect(slots[0].startTime).to.equal('2024-11-15T08:00:00.000Z');
        expect(slots[0].endTime).to.equal('2024-11-15T08:30:00.000Z');

        expect(slots[1].startTime).to.equal('2024-11-15T08:30:00.000Z');
        expect(slots[1].endTime).to.equal('2024-11-15T09:00:00.000Z');

        expect(slots[2].startTime).to.equal('2024-11-15T09:00:00.000Z');
        expect(slots[2].endTime).to.equal('2024-11-15T09:30:00.000Z');
    });


    it('should generate 1-minute time slots', () => {
        const dentistId = '202';
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T08:10:00Z';

        const slots = generateSlots(dentistId, startDateISO, endDateISO, 1);


        const expectedSlots = [
            { dentistId: '202', startTime: '2024-11-15T08:00:00.000Z', endTime: '2024-11-15T08:01:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:01:00.000Z', endTime: '2024-11-15T08:02:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:02:00.000Z', endTime: '2024-11-15T08:03:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:03:00.000Z', endTime: '2024-11-15T08:04:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:04:00.000Z', endTime: '2024-11-15T08:05:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:05:00.000Z', endTime: '2024-11-15T08:06:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:06:00.000Z', endTime: '2024-11-15T08:07:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:07:00.000Z', endTime: '2024-11-15T08:08:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:08:00.000Z', endTime: '2024-11-15T08:09:00.000Z' },
            { dentistId: '202', startTime: '2024-11-15T08:09:00.000Z', endTime: '2024-11-15T08:10:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);

        expect(slots).to.have.lengthOf(10);
    });

    it('should return an empty array if start date equals end date', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T08:00:00Z';

        const slots = generateSlots(dentistId, startDateISO, endDateISO);

        expect(slots).to.have.lengthOf(0);
    });

    it('should return an empty array if the duration is longer than the time range', function () {
        const dentistId = '101';
        const startDateISO = '2024-11-21T08:00:00Z';
        const endDateISO = '2024-11-21T09:00:00Z';
        const slots = generateSlots(dentistId, startDateISO, endDateISO, 120);

        expect(slots).to.have.lengthOf(0);
    });

    it('should return an empty array if the start date is after the end date', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T10:00:00Z';
        const endDateISO = '2024-11-15T08:00:00Z';

        const slots = generateSlots(dentistId, startDateISO, endDateISO);

        expect(slots).to.have.lengthOf(0);
    });

    it('should handle cases where the last slot extends to the end date', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T09:00:00Z';

        const slots = generateSlots(dentistId, startDateISO, endDateISO, 60);

        expect(slots).to.have.lengthOf(1);

        expect(slots[0].startTime).to.equal('2024-11-15T08:00:00.000Z');
        expect(slots[0].endTime).to.equal('2024-11-15T09:00:00.000Z');
    });

    it('should handle edge case where the end time is exactly on the slot boundary', function () {
        const dentistId = '202';
        const startDateISO = '2024-11-21T08:00:00Z';
        const endDateISO = '2024-11-21T10:00:00Z';
        const slots = generateSlots(dentistId, startDateISO, endDateISO, 120);

        const expectedSlots = [
            { dentistId: '202', startTime: '2024-11-21T08:00:00.000Z', endTime: '2024-11-21T10:00:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);
    });
});

describe('generateRepeatedTimeSlots', () => {
    it('should generate slots for a single day', () => {
        const dentistId = '202';
        const startDateISO = '2024-11-21T08:00:00.000Z';
        const endDateISO = '2024-11-21T10:00:00.000Z';
        const slots = generateRepeatedTimeSlots(dentistId, startDateISO, endDateISO, 120);

        const expectedSlots = [
            { dentistId: '202', startTime: '2024-11-21T08:00:00.000Z', endTime: '2024-11-21T10:00:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);
    });

    it('should generate slots across multiple days', () => {
        const dentistId = '303';
        const startDateISO = '2024-11-21T08:00:00.000Z';
        const endDateISO = '2024-11-23T10:00:00.000Z';
        const slots = generateRepeatedTimeSlots(dentistId, startDateISO, endDateISO, 120);

        const expectedSlots = [
            { dentistId: '303', startTime: '2024-11-21T08:00:00.000Z', endTime: '2024-11-21T10:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-22T08:00:00.000Z', endTime: '2024-11-22T10:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-23T08:00:00.000Z', endTime: '2024-11-23T10:00:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);
    });

    it('should generate slots across multiple months', () => {
        const dentistId = '303';
        const startDateISO = '2024-11-30T08:00:00.000Z';
        const endDateISO = '2024-12-02T10:00:00.000Z';
        const slots = generateRepeatedTimeSlots(dentistId, startDateISO, endDateISO, 120);

        const expectedSlots = [
            { dentistId: '303', startTime: '2024-11-30T08:00:00.000Z', endTime: '2024-11-30T10:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-01T08:00:00.000Z', endTime: '2024-12-01T10:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-02T08:00:00.000Z', endTime: '2024-12-02T10:00:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);
    });

    it('should return an empty array when startDateISO is after endDateISO', () => {
        const dentistId = 'dentist123';
        const startDateISO = '2024-11-24T08:00:00.000Z';
        const endDateISO = '2024-11-21T12:00:00.000Z';
        const slots = generateRepeatedTimeSlots(dentistId, startDateISO, endDateISO, 60);

        expect(slots).to.be.empty;
    });

    it('should handle cases where start and end date are the same but different times', () => {
        const dentistId = '303';
        const startDateISO = '2024-11-21T10:00:00.000Z';
        const endDateISO = '2024-11-21T14:00:00.000Z';
        const slots = generateRepeatedTimeSlots(dentistId, startDateISO, endDateISO, 60);

        const expectedSlots = [
            { dentistId: '303', startTime: '2024-11-21T10:00:00.000Z', endTime: '2024-11-21T11:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-21T11:00:00.000Z', endTime: '2024-11-21T12:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-21T12:00:00.000Z', endTime: '2024-11-21T13:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-21T13:00:00.000Z', endTime: '2024-11-21T14:00:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);
    });

    it('should handle cases where end time is earlier than start time in the day', () => {
        const dentistId = '303';
        const startDateISO = '2024-11-21T22:00:00.000Z';
        const endDateISO = '2024-12-21T23:00:00.000Z';
        const slots = generateRepeatedTimeSlots(dentistId, startDateISO, endDateISO, 60);

        const expectedSlots = [
            { dentistId: '303', startTime: '2024-11-21T22:00:00.000Z', endTime: '2024-11-21T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-22T22:00:00.000Z', endTime: '2024-11-22T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-23T22:00:00.000Z', endTime: '2024-11-23T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-24T22:00:00.000Z', endTime: '2024-11-24T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-25T22:00:00.000Z', endTime: '2024-11-25T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-26T22:00:00.000Z', endTime: '2024-11-26T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-27T22:00:00.000Z', endTime: '2024-11-27T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-28T22:00:00.000Z', endTime: '2024-11-28T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-29T22:00:00.000Z', endTime: '2024-11-29T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-11-30T22:00:00.000Z', endTime: '2024-11-30T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-01T22:00:00.000Z', endTime: '2024-12-01T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-02T22:00:00.000Z', endTime: '2024-12-02T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-03T22:00:00.000Z', endTime: '2024-12-03T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-04T22:00:00.000Z', endTime: '2024-12-04T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-05T22:00:00.000Z', endTime: '2024-12-05T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-06T22:00:00.000Z', endTime: '2024-12-06T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-07T22:00:00.000Z', endTime: '2024-12-07T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-08T22:00:00.000Z', endTime: '2024-12-08T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-09T22:00:00.000Z', endTime: '2024-12-09T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-10T22:00:00.000Z', endTime: '2024-12-10T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-11T22:00:00.000Z', endTime: '2024-12-11T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-12T22:00:00.000Z', endTime: '2024-12-12T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-13T22:00:00.000Z', endTime: '2024-12-13T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-14T22:00:00.000Z', endTime: '2024-12-14T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-15T22:00:00.000Z', endTime: '2024-12-15T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-16T22:00:00.000Z', endTime: '2024-12-16T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-17T22:00:00.000Z', endTime: '2024-12-17T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-18T22:00:00.000Z', endTime: '2024-12-18T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-19T22:00:00.000Z', endTime: '2024-12-19T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-20T22:00:00.000Z', endTime: '2024-12-20T23:00:00.000Z' },
            { dentistId: '303', startTime: '2024-12-21T22:00:00.000Z', endTime: '2024-12-21T23:00:00.000Z' },
        ];

        assert.deepStrictEqual(slots, expectedSlots);
    });
});

describe('isValidIsoDate', function () {
    it('should return true for valid leap year date', function () {
        assert.strictEqual(isValidIsoDate('2024-02-29T12:30'), true);
    });

    it('should return true for valid non-leap year date', function () {
        assert.strictEqual(isValidIsoDate('2024-02-28T23:59'), true);
    });

    it('should return false for invalid leap year date', function () {
        assert.strictEqual(isValidIsoDate('2024-02-30T12:30'), false);
    });

    it('should return false for invalid day in January', function () {
        assert.strictEqual(isValidIsoDate('2024-01-32T12:30'), false);
    });

    it('should return false for non-existent month', function () {
        assert.strictEqual(isValidIsoDate('2024-13-01T12:30'), false);
    });

    it('should return false for invalid day in April', function () {
        assert.strictEqual(isValidIsoDate('2024-04-31T12:30'), false);
    });

    it('should return false for invalid hour', function () {
        assert.strictEqual(isValidIsoDate('2024-11-30T25:00'), false);
    });

    it('should return false for invalid minute', function () {
        assert.strictEqual(isValidIsoDate('2024-11-19T12:60'), false);
    });

    it('should return true for valid date and time', function () {
        assert.strictEqual(isValidIsoDate('2024-11-19T12:30'), true);
    });

    it('should return true for valid end of the year date', function () {
        assert.strictEqual(isValidIsoDate('2023-12-31T23:59'), true);
    });

    it('should return true for valid start of the day date', function () {
        assert.strictEqual(isValidIsoDate('2023-12-31T00:00'), true);
    });

    it('should return true for valid non-leap year date', function () {
        assert.strictEqual(isValidIsoDate('2024-03-01T00:00'), true);
    });

    it('should return true for valid date and time', function () {
        assert.strictEqual(isValidIsoDate('2024-03-01T12:00'), true);
    });

    it('should return true for valid leap year February date', function () {
        assert.strictEqual(isValidIsoDate('2020-02-29T12:30'), true);
    });

    it('should return false for invalid hour 24', function () {
        assert.strictEqual(isValidIsoDate('2024-02-29T24:00'), false);
    });

    it('should return false for invalid minute 60', function () {
        assert.strictEqual(isValidIsoDate('2024-02-29T23:60'), false);
    });

    it('should return true for valid date and time in June', function () {
        assert.strictEqual(isValidIsoDate('2024-06-15T07:00'), true);
    });

    it('should return true for valid date and time in June with a specific minute', function () {
        assert.strictEqual(isValidIsoDate('2024-06-15T07:01'), true);
    });

    it('should return true for valid start of November', function () {
        assert.strictEqual(isValidIsoDate('2023-11-01T00:00'), true);
    });

    it('should return true for valid end of the day in November', function () {
        assert.strictEqual(isValidIsoDate('2023-11-01T23:59'), true);
    });

    it('should return true for valid date and time with milliseconds and Z', function () {
        assert.strictEqual(isValidIsoDate('2023-11-01T23:59:00.000Z'), true);
    });
});