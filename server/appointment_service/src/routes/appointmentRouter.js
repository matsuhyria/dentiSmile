import express from 'express';
import { bookAppointment } from '../controllers/appointmentController.js';

const router = express.Router();
const BASE_PATH = '/api/v1';

router.post(`${BASE_PATH}/appointments/:id/bookings`, bookAppointment);

export default router;