import express from 'express';
import { createAppointments } from '../controllers/appointmentController.js';

const router = express.Router();
const BASE_PATH = '/api/v1';

router.post(`${BASE_PATH}/appointments`, createAppointments);

export default router;