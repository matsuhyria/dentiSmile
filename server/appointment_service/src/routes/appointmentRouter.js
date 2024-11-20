import express from 'express';
import { createAppointments, getAppointment, getAppointments } from '../controllers/appointmentController.js';

const router = express.Router();
const BASE_PATH = '/api/v1';

router.get(`${BASE_PATH}/appointments`, getAppointments);
router.post(`${BASE_PATH}/appointments`, createAppointments);
router.get(`${BASE_PATH}/appointments/:appointmentId`, getAppointment);

export default router;