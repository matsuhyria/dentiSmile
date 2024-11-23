import express from 'express';
import { createAppointments, getAppointments, bookAppointment, getSlotDetails } from '../controllers/appointmentController.js';

const router = express.Router();
const BASE_PATH = '/api/v1';

router.get(`${BASE_PATH}/appointments`, getAppointments);
router.post(`${BASE_PATH}/appointments/:id/bookings`, bookAppointment);
router.get(`${BASE_PATH}/appointments/:id`, getSlotDetails);
router.post(`${BASE_PATH}/appointments`, createAppointments);

export default router;