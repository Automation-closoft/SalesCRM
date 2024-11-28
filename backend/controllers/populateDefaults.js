import { TypeOfCustomer, Application, SOW, Brand, SalesCrm } from "../models/crmModel.js";
import mongoose from 'mongoose';


const populateDefaults = async () => {
  try {
    await TypeOfCustomer.insertMany([
      { name: "Machine Builders" }, { name: "OEM/MFG" }, { name: "PID" }, 
      { name: "TSC" }, { name: "PnC" }, { name: "PSI" }, { name: "PSU" }, 
      { name: "EPC/MEP" }
    ]);

    await Application.insertMany([
      { name: "SG/DG Sych" }, { name: "Testing Bench/EOL/SPM" }, 
      { name: "Water & WW Treatment" }, { name: "Energy Management" }, 
      { name: "HVAC/BMS/CPM" }, { name: "Discrete Manufacturing" }, 
      { name: "Metering Skids" }
    ]);

    await SOW.insertMany([
      { name: "Backend Development & Testing" }, { name: "EMS (Shop Floor)" },
      { name: "EMS (Site)" }, { name: "Engineering Design" }, 
      { name: "Consultant Documentation" }, { name: "Project (E2E)" }, 
      { name: "Trading" }, { name: "OD & STC" }
    ]);

    await Brand.insertMany([
      { name: "Siemens" }, { name: "Schneider" }, { name: "Rockwell" }, 
      { name: "Mitsubishi" }, { name: "Delta" }, { name: "Omron" }, 
      { name: "GE" }, { name: "ABB" }, { name: "Others" }
    ]);

    console.log("Dropdowns populated successfully!");
  } catch (error) {
    console.error("Error populating dropdowns:", error);
  }
};

const addClient = async (req, res) => {
  try {
    if (!req.body.customerName || !req.body.rfqDate || !req.body.projectName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const client = new SalesCrm({
      customerName: req.body.customerName,
      customerLocation : req.body.customerLocation,
      rfqDate: req.body.rfqDate,
      typeOfCustomer: req.body.typeOfCustomer,
      projectName: req.body.projectName,
      sow: req.body.sow,
      quotedValue: req.body.quotedValue,
      currency: req.body.currency,
      application: req.body.application,
      expectedClosureMonth: req.body.expectedClosureMonth,
      brand: req.body.brand,
      natureOfRFQ: req.body.natureOfRFQ,
      statusOfRFQ: req.body.statusOfRFQ,
      remarks: req.body.remarks || [], 
    });

    const savedClient = await client.save();
    
    res.status(201).json({
      message: 'Client added successfully!',
      data: savedClient,
    });
  } catch (error) {
    console.error('Error while adding client:', error);

    res.status(500).json({
      message: 'Failed to add client',
      error: error.message,
    });
  }
}


const getAllClients = async (req, res) => {
  try {
    const clients = await SalesCrm.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve clients', error: error.message });
  }
};

const clientDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await SalesCrm.findById(id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve client', error: error.message });
  }
};


const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid client ID format' 
      });
    }
    const delClient = await SalesCrm.findByIdAndDelete(id);
    if (!delClient) {
      return res.status(404).json({ 
        message: 'Client not found' 
      });
    }
    res.status(200).json({
      message: 'Client deleted successfully!',
      data: delClient,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete client', 
      error: error.message 
    });
  }
};


export {populateDefaults, addClient, getAllClients,deleteClient,clientDetail}
