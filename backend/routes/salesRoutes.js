import express from "express";
import { addClient,getAllClients,deleteClient,clientDetail,updateClientStatus, } from '../controllers/populateDefaults.js';

const router = express.Router();

router.post('/add', addClient);
router.get('/all', getAllClients);
router.delete('/:id',deleteClient);
router.get('/:id',clientDetail);
router.patch("/update/:id", updateClientStatus);

export default router;
