import express from "express";
import { addClient,getAllClients,deleteClient,clientDetail,updateClientStatus,getDropdownData, reportGen, addCustomInput,generateCustomerTypeReport,deleteDropdownValue, updateClientRemarks } from '../controllers/populateDefaults.js';
const router = express.Router();
router.post('/add', addClient);
router.get('/all', getAllClients);
router.get('/dropdowns', getDropdownData);
router.delete('/:id',deleteClient);
router.get('/:id',clientDetail);
router.patch("/update/:id", updateClientStatus);
router.patch("/updateRemarks/:id", updateClientRemarks);
router.post("/report",reportGen)
router.post('/add-custom-input', addCustomInput);
router.post("/customer-type-report", generateCustomerTypeReport);
router.delete('/dropdown/:category/:name', deleteDropdownValue);
export default router;