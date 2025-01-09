import { expect } from 'chai';
import sinon from 'sinon';
import { createAppointments } from '../../../src/controllers/appointmentController.js';
import AppointmentSlot from '../../../src/models/appointmentSlot.js';
import { describe, beforeEach, afterEach, it } from 'mocha';

const isValidIsoDate = sinon.stub();

describe('createAppointments', () => {
    let findStub;

    beforeEach(() => {
        findStub = sinon.stub(AppointmentSlot, 'find');
    });

    afterEach(() => {
        findStub.restore();
        sinon.restore();
    });

    it('should return 400 if the date format is invalid', async () => {
        isValidIsoDate.returns(false);

        const message = JSON.stringify({
        clinicName: 'Clinic A',
        clinicId: '1',
        dentistId: '1',
        startTime: 'invalid-date',
        endTime: '2025-05-05T10:00:00Z',
        duration: 30,
        });

        const result = await createAppointments(message);
        expect(result.status.code).to.equal(400);
        expect(result.status.message).to.equal('Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) or (YYYY-MM-DDTHH:mm)');
    });

    it('should return 400 if the dates are in the past', async () => {
        const message = JSON.stringify({
        clinicName: 'Clinic A',
        clinicId: '1',
        dentistId: '1',
        startTime: '2020-05-05T10:00:00Z',
        endTime: '2020-05-05T11:00:00Z',
        duration: 30,
        });

        const result = await createAppointments(message);
        expect(result.status.code).to.equal(400);
        expect(result.status.message).to.equal('Dates cannot be in the past');
    });

    it('should return 400 if appointment slots already exist for the timeframe', async () => {
        const message = JSON.stringify({
        clinicName: 'Clinic A',
        clinicId: '1',
        dentistId: '1',
        startTime: '2025-05-05T10:00:00Z',
        endTime: '2025-05-05T11:00:00Z',
        duration: 30,
        });

        findStub.resolves([{ startTime: '2025-05-05T09:00:00Z', endTime: '2025-05-05T10:00:00Z' }]);

        const result = await createAppointments(message);
        expect(result.status.code).to.equal(400);
        expect(result.status.message).to.equal('Slots for this timeframe already exist');
    });
});
