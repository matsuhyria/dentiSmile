import express from 'express';
import { bookAppointment, getSlotDetailt } from '../controllers/appointmentController.js';

const router = express.Router();
const BASE_PATH = '/api/v1';

router.post(`${BASE_PATH}/appointments/:id/bookings`, bookAppointment);
router.get(`${BASE_PATH}/appointments/:id`, getSlotDetailt);

export default router;