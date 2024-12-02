import express from "express";
import { addClient,getAllClients,deleteClient,clientDetail,updateClientStatus,getDropdownData, reportGen } from '../controllers/populateDefaults.js';

const router = express.Router();

router.post('/add', addClient);
router.get('/all', getAllClients);
router.get('/dropdowns', getDropdownData);
router.delete('/:id',deleteClient);
router.get('/:id',clientDetail);
router.patch("/update/:id", updateClientStatus);
router.post("/report",reportGen)

export default router;
