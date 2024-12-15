import { TypeOfCustomer, Application, SOW, Brand, SalesCrm } from "../models/crmModel.js";
import mongoose from 'mongoose';
const addClient = async (req, res) => {
  try {
    if (!req.body.customerName || !req.body.rfqDate || !req.body.projectName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const client = new SalesCrm({
      customerName: req.body.customerName,
      customerLocation : req.body.customerLocation,
      customerPOC : req.body.customerPOC,
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

const updateClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusOfRFQ } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }
    const updatedClient = await SalesCrm.findByIdAndUpdate(
      id,
      { statusOfRFQ },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update client status",
      error: error.message,
    });
  }
};

const getDropdownData = async (req, res) => {
  try {
    const typeOfCustomers = await TypeOfCustomer.find();
    const applications = await Application.find();
    const sows = await SOW.find();
    const brands = await Brand.find();
    res.status(200).json({
      success: true,
      typeOfCustomers,
      applications,
      sows,
      brands,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching dropdown data" });
  }
};

const reportGen = async (req, res) => {
  try {
    const { reportType, year, month, quarter, customStartDate, customEndDate } = req.body;
    let query = {};
    if (reportType === 'custom') {
      if (!customStartDate || !customEndDate) {
        return res.status(400).json({ success: false, message: 'Custom start and end dates are required.' });
      }
      if (new Date(customStartDate) > new Date(customEndDate)) {
        return res.status(400).json({ success: false, message: 'Start date cannot be after end date.' });
      }
      query = { rfqDate: { $gte: customStartDate, $lte: customEndDate } };
    }
    else if (reportType === 'yearly') {
      query = { rfqDate: { $gte: `${year}-01-01`, $lte: `${year}-12-31` } };
    }
    else if (reportType === 'quarterly') {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      query = { rfqDate: { $gte: `${year}-${startMonth}-01`, $lte: `${year}-${endMonth}-31` } };
    }
    const report = await SalesCrm.find(query);
    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report.' });
  }
};


  const addCustomInput = async (req, res) => {
    try {
      const { typeOfCustomer, applications, sow, brands } = req.body;
      if (typeOfCustomer) {
        const newType = new TypeOfCustomer({ name: typeOfCustomer });
        await newType.save();
      }
      if (applications) {
        const newApp = new Application({ name: applications });
        await newApp.save();
      }
      if (sow) {
        const newSow = new SOW({ name: sow });
        await newSow.save();
      }
      if (brands) {
        const newBrand = new Brand({ name: brands });
        await newBrand.save();
      }
      res.status(200).json({ message: 'Custom inputs added successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding custom inputs', error: error.message });
    }
  };

export {
  addClient,
  getAllClients,
  deleteClient,
  clientDetail,
  updateClientStatus,
  getDropdownData,
  reportGen,
  addCustomInput,
};