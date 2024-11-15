import express from 'express';
import { createAppointment } from '../controllers/appointmentController.js';

const router = express.Router();
const BASE_PATH = '/api/v1';

router.post(`${BASE_PATH}/appointments`, createAppointment);

export default router;