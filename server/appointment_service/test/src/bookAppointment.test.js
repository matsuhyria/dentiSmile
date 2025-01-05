import { bookAppointment } from '../../src/controllers/appointmentController.js';
import AppointmentSlot from '../../src/models/appointmentSlot.js';

import { expect } from 'chai';
import sinon from 'sinon';
import { describe, beforeEach, afterEach, it } from 'mocha';


describe('bookAppointment', () => {
  let findByIdStub;

  beforeEach(() => {
    // a stub for AppointmentSlot.findById to mock behavior
    findByIdStub = sinon.stub(AppointmentSlot, 'findById');
  });

  afterEach(() => {
    findByIdStub.restore();
  });

  it('should return 404 if appointment slot is not found', async () => {
    findByIdStub.resolves(null);

    const message = JSON.stringify({ patientId: '1', appointmentId: '123' });
    const result = await bookAppointment(message);

    expect(result.status.code).to.equal(404);
    expect(result.status.message).to.equal('Appointment slot not found');
  });

  it('should return 400 if appointment slot is not available', async () => {
    findByIdStub.resolves({ status: 'booked', save: sinon.stub() });

    const message = JSON.stringify({ patientId: '1', appointmentId: '123' });
    const result = await bookAppointment(message);

    expect(result.status.code).to.equal(400);
    expect(result.status.message).to.equal('Appointment slot is not available');
  });

  it('should successfully book an available appointment slot', async () => {
    const mockSlot = { status: 'available', save: sinon.stub() };
    findByIdStub.resolves(mockSlot);

    const message = JSON.stringify({ patientId: '1', appointmentId: '123' });
    const result = await bookAppointment(message);

    expect(result.status.code).to.equal(200);
    expect(result.status.message).to.equal('Appointment slot booked successfully');
    expect(mockSlot.save.calledOnce).to.be.true;
  });

  it('should return 500 if there is an error during the booking process', async () => {
    findByIdStub.rejects(new Error('Database error'));

    const message = JSON.stringify({ patientId: '1', appointmentId: '123' });
    const result = await bookAppointment(message);

    expect(result.status.code).to.equal(500);
    expect(result.status.message).to.equal('Error booking appointment');
  });

});
