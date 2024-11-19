import { compareIsoDates, generateTimeSlots } from '../../../src/utils/dateUtils.js';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('compareIsoDates', () => {
    // if the date is invalid, moment throws an error

    // compare days
    it('DAYS: should return negative if the first is earlier', () => {
        const date1 = '2024-11-01T12:00:00Z';
        const date2 = '2024-11-02T12:00:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.below(0);
    });

    it('DAYS: should return positive if the second is earlier', () => {
        const date1 = '2024-11-02T12:00:00Z';
        const date2 = '2024-11-01T12:00:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.above(0);
    });

    it('DAYS: should return 0 if both are the same', () => {
        const date1 = '2024-11-01T12:00:00Z';
        const date2 = '2024-11-01T12:00:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.equal(0);
    });

    // compare hours
    it('HOURS: should return negative if the first is earlier', () => {
        const date1 = '2024-11-01T11:00:00Z';
        const date2 = '2024-11-01T12:00:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.below(0);
    });

    it('HOURS: should return positive if the second is earlier', () => {
        const date1 = '2024-11-01T12:00:00Z';
        const date2 = '2024-11-01T11:00:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.above(0);
    });

    it('HOURS: should return 0 if both are the same', () => {
        const date1 = '2024-11-01T12:00:00Z';
        const date2 = '2024-11-01T12:00:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.equal(0);
    });

    // compare minutes
    it('MINUTES: should return negative if the first is earlier', () => {
        const date1 = '2024-11-01T12:30:00Z';
        const date2 = '2024-11-01T12:31:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.below(0);
    });

    it('MINUTES: should return positive if the second is earlier', () => {
        const date1 = '2024-11-01T12:31:00Z';
        const date2 = '2024-11-01T12:30:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.above(0);
    });

    it('MINUTES: should return 0 if both are the same', () => {
        const date1 = '2024-11-01T12:30:00Z';
        const date2 = '2024-11-01T12:30:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.equal(0);
    });

    // compare seconds
    it('SECONDS: should return negative if the first is earlier', () => {
        const date1 = '2024-11-01T12:00:30Z';
        const date2 = '2024-11-01T12:00:31Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.below(0);
    });

    it('SECONDS: should return positive if the second is earlier', () => {
        const date1 = '2024-11-01T12:00:31Z';
        const date2 = '2024-11-01T12:00:30Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.above(0);
    });

    it('SECONDS: should return 0 if both are the same', () => {
        const date1 = '2024-11-01T12:00:30Z';
        const date2 = '2024-11-01T12:00:30Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.equal(0);
    });
});

describe('generateTimeSlots', () => {
    // if the date is invalid, moment throws an error

    it('should generate 1-hour time slots between start and end dates', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T10:00:00Z';

        const slots = generateTimeSlots(dentistId, startDateISO, endDateISO);

        expect(slots).to.have.lengthOf(2);

        expect(slots[0]).to.have.property('dentistId').that.equals(dentistId);
        expect(slots[0].startTime).to.equal('2024-11-15T08:00:00.000Z');
        expect(slots[0].endTime).to.equal('2024-11-15T09:00:00.000Z');

        expect(slots[1].startTime).to.equal('2024-11-15T09:00:00.000Z');
        expect(slots[1].endTime).to.equal('2024-11-15T10:00:00.000Z');
    });

    it('should generate 30-minute time slots', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T09:30:00Z';

        const slots = generateTimeSlots(dentistId, startDateISO, endDateISO, 30);

        expect(slots).to.have.lengthOf(3);

        expect(slots[0].startTime).to.equal('2024-11-15T08:00:00.000Z');
        expect(slots[0].endTime).to.equal('2024-11-15T08:30:00.000Z');

        expect(slots[1].startTime).to.equal('2024-11-15T08:30:00.000Z');
        expect(slots[1].endTime).to.equal('2024-11-15T09:00:00.000Z');

        expect(slots[2].startTime).to.equal('2024-11-15T09:00:00.000Z');
        expect(slots[2].endTime).to.equal('2024-11-15T09:30:00.000Z');
    });


    it('should generate 1-minute time slots', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T08:10:00Z';

        const slots = generateTimeSlots(dentistId, startDateISO, endDateISO, 1);

        expect(slots).to.have.lengthOf(10);
    });

    it('should return an empty array if start date equals end date', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T08:00:00Z';

        const slots = generateTimeSlots(dentistId, startDateISO, endDateISO);

        expect(slots).to.have.lengthOf(0);
    });

    it('should return an empty array if the start date is after the end date', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T10:00:00Z';
        const endDateISO = '2024-11-15T08:00:00Z';

        const slots = generateTimeSlots(dentistId, startDateISO, endDateISO);

        expect(slots).to.have.lengthOf(0);
    });

    it('should handle cases where the last slot extends to the end date', () => {
        const dentistId = 1;
        const startDateISO = '2024-11-15T08:00:00Z';
        const endDateISO = '2024-11-15T09:00:00Z';

        const slots = generateTimeSlots(dentistId, startDateISO, endDateISO, 60);

        expect(slots).to.have.lengthOf(1);

        expect(slots[0].startTime).to.equal('2024-11-15T08:00:00.000Z');
        expect(slots[0].endTime).to.equal('2024-11-15T09:00:00.000Z');
    });
});