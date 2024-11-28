import express from "express";
import { addClient,getAllClients,deleteClient,clientDetail } from '../controllers/populateDefaults.js';

const router = express.Router();

router.post('/add', addClient);
router.get('/all', getAllClients);
router.delete('/:id',deleteClient);
router.get('/:id',clientDetail);

export default router;
