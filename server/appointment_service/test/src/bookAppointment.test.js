import { bookAppointment } from '../../src/controllers/appointmentController.js';
import AppointmentSlot from '../../src/models/appointmentSlot.js';

import { expect } from 'chai';
import sinon from 'sinon';


describe('bookAppointment', () => {
  let findByIdStub;

  beforeEach(() => {
    // Create a stub for AppointmentSlot.findById to mock its behavior
    findByIdStub = sinon.stub(AppointmentSlot, 'findById');
  });

  afterEach(() => {
    // Restore the original method after each test
    findByIdStub.restore();
  });

  it('should return 404 if appointment slot is not found', async () => {
    // Mock AppointmentSlot.findById to return null
    findByIdStub.resolves(null);

    const message = JSON.stringify({ patientId: '1', appointmentId: '123' });
    const result = await bookAppointment(message);

    expect(result.status.code).to.equal(404);
    expect(result.status.message).to.equal('Appointment slot not found');
  });

  it('should return 400 if appointment slot is not available', async () => {
    // Mock AppointmentSlot.findById to return a slot with status "booked"
    findByIdStub.resolves({ status: 'booked', save: sinon.stub() });

    const message = JSON.stringify({ patientId: '1', appointmentId: '123' });
    const result = await bookAppointment(message);

    expect(result.status.code).to.equal(400);
    expect(result.status.message).to.equal('Appointment slot is not available');
  });

});
