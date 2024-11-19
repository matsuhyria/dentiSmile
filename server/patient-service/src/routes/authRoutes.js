import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();
const BASE_PATH = '/api/v1';

router.post(`${BASE_PATH}/patient/register`, register);
router.post(`${BASE_PATH}/patient/login`, login);

export default router;