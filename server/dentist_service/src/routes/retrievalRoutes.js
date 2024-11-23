import express from 'express';
import { retrieveAllDentists, retrieveDentist } from "../controllers/dentistRetriever.js";

const router = express.Router();
const BASE_PATH = '/api/v1';

router.get(`${BASE_PATH}/dentists/`, retrieveAllDentists);
router.get(`${BASE_PATH}/dentists/:id`, retrieveDentist);

export default router;