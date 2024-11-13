import { compareIsoDates } from '../../../src/utils/dateUtils.js';
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
    it('MInUTES: should return negative if the first is earlier', () => {
        const date1 = '2024-11-01T12:30:00Z';
        const date2 = '2024-11-01T12:31:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.below(0);
    });

    it('MInUTES: should return positive if the second is earlier', () => {
        const date1 = '2024-11-01T12:31:00Z';
        const date2 = '2024-11-01T12:30:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.above(0);
    });

    it('MInUTES: should return 0 if both are the same', () => {
        const date1 = '2024-11-01T12:30:00Z';
        const date2 = '2024-11-01T12:30:00Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.equal(0);
    });

    // compare seconds
    it('SECOnDS: should return negative if the first is earlier', () => {
        const date1 = '2024-11-01T12:00:30Z';
        const date2 = '2024-11-01T12:00:31Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.below(0);
    });

    it('SECOnDS: should return positive if the second is earlier', () => {
        const date1 = '2024-11-01T12:00:31Z';
        const date2 = '2024-11-01T12:00:30Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.above(0);
    });

    it('SECOnDS: should return 0 if both are the same', () => {
        const date1 = '2024-11-01T12:00:30Z';
        const date2 = '2024-11-01T12:00:30Z';
        const result = compareIsoDates(date1, date2);
        expect(result).to.be.equal(0);
    });
});