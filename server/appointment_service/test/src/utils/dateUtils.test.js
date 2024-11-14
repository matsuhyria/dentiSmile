import { compareIsoDates, generateTimeSlots } from '../../../src/utils/dateUtils.js';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('compareIsoDates', () => {
    // compare types
    it('TYPES: should handle invalid date strings and return NaN', function () {
        const date1 = 'invalid-date';
        const date2 = '2024-11-01T12:00:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.NaN;
    });

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

const HOUR_MILLIS = 1000 * 60 * 60;

describe('generateTimeSlots', () => {
    it('should generate slots for each hour between 8 AM and 4 PM', () => {
        const startIsoDate = '2024-12-01T08:00:00.000Z';
        const endIsoDate = '2024-12-01T16:00:00.000Z';
        const dentistId = 'dentist-123';

        const slots = generateTimeSlots(startIsoDate, endIsoDate, dentistId);

        expect(slots).to.have.lengthOf(8);

        // ensure each slot is exactly one hour
        slots.forEach((slot) => {
            const startTime = new Date(slot.startTime);
            const endTime = new Date(slot.endTime);

            expect((endTime - startTime) / (HOUR_MILLIS)).to.equal(1);
        });
    });

    it('should generate slots across multiple days', () => {
        const startIsoDate = '2023-12-01T00:00:00.000Z';
        const endIsoDate = '2023-12-03T23:59:59.000Z';
        const dentistId = 'dentist-123';

        const slots = generateTimeSlots(startIsoDate, endIsoDate, dentistId);

        expect(slots).to.have.lengthOf(24);

        // ensure each slot is exactly one hour
        slots.forEach((slot) => {
            const startTime = new Date(slot.startTime);
            const endTime = new Date(slot.endTime);

            expect((endTime - startTime) / (HOUR_MILLIS)).to.equal(1);
        });
    });
});