import {
  TypeOfCustomer,
  Application,
  SOW,
  Brand,
  SalesCrm,
} from "../models/crmModel.js";
import mongoose from "mongoose";
const addClient = async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.customerName || !req.body.rfqDate || !req.body.projectName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch names based on IDs
    const typeOfCustomerName = await TypeOfCustomer.findById(req.body.typeOfCustomer).select('name').lean();
    const sowName = await SOW.findById(req.body.sow).select('name').lean();
    const applicationName = await Application.findById(req.body.application).select('name').lean();
    const brandName = await Brand.findById(req.body.brand).select('name').lean();

    if (!typeOfCustomerName || !sowName || !applicationName || !brandName) {
      return res.status(400).json({ message: "Invalid category ID(s) provided." });
    }

    // Create a new SalesCrm entry with category names instead of IDs
    const client = new SalesCrm({
      customerName: req.body.customerName,
      customerLocation: req.body.customerLocation,
      customerPOC: req.body.customerPOC,
      rfqDate: req.body.rfqDate,
      typeOfCustomer: typeOfCustomerName.name, // Store name
      projectName: req.body.projectName,
      sow: sowName.name, // Store name
      quotedValue: req.body.quotedValue,
      currency: req.body.currency,
      application: applicationName.name, // Store name
      expectedClosureMonth: req.body.expectedClosureMonth,
      brand: brandName.name, // Store name
      natureOfRFQ: req.body.natureOfRFQ,
      statusOfRFQ: req.body.statusOfRFQ,
      remarks: req.body.remarks || [],
    });

    // Save the client data
    const savedClient = await client.save();

    // Respond with success message
    res.status(201).json({
      message: "Client added successfully!",
      data: savedClient,
    });
  } catch (error) {
    console.error("Error while adding client:", error);

    res.status(500).json({
      message: "Failed to add client",
      error: error.message,
    });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await SalesCrm.find();
    res.status(200).json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve clients", error: error.message });
  }
};

const clientDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await SalesCrm.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve client", error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid client ID format",
      });
    }
    const delClient = await SalesCrm.findByIdAndDelete(id);
    if (!delClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }
    res.status(200).json({
      message: "Client deleted successfully!",
      data: delClient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete client",
      error: error.message,
    });
  }
};

const updateClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusOfRFQ, customerLocation, quotedValue, remarks } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }
    const updateFields = {};
    if (statusOfRFQ !== undefined) updateFields.statusOfRFQ = statusOfRFQ;
    if (customerLocation !== undefined)
      updateFields.customerLocation = customerLocation;
    if (quotedValue !== undefined) updateFields.quotedValue = quotedValue;
    if (remarks) {
      if (typeof remarks === "string") {
        const remarksArray = remarks.split(",");
        updateFields.$push = { remarks: { $each: remarksArray } };
      } else if (Array.isArray(remarks)) {
        updateFields.$push = { remarks: { $each: remarks } };
      }
    }
    const updatedClient = await SalesCrm.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update client details",
      error: error.message,
    });
  }
};

const getDropdownData = async (req, res) => {
  try {
    const typeOfCustomers = await TypeOfCustomer.find();
    const application = await Application.find();
    const sow = await SOW.find();
    const brand = await Brand.find();
    res.status(200).json({
      success: true,
      typeOfCustomers,
      application,
      sow,
      brand,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching dropdown data" });
  }
};

const reportGen = async (req, res) => {
  try {
    const { reportType, year, month, quarter, customStartDate, customEndDate } =
      req.body;
    let query = {};
    if (reportType === "custom") {
      if (!customStartDate || !customEndDate) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Custom start and end dates are required.",
          });
      }
      if (new Date(customStartDate) > new Date(customEndDate)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Start date cannot be after end date.",
          });
      }
      query = { rfqDate: { $gte: customStartDate, $lte: customEndDate } };
    } else if (reportType === "yearly") {
      query = { rfqDate: { $gte: `${year}-01-01`, $lte: `${year}-12-31` } };
    } else if (reportType === "quarterly") {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      query = {
        rfqDate: {
          $gte: `${year}-${startMonth}-01`,
          $lte: `${year}-${endMonth}-31`,
        },
      };
    }
    const report = await SalesCrm.find(query);
    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate report." });
  }
};

const addCustomInput = async (req, res) => {
  try {
    const { typeOfCustomer, application, sow, brand } = req.body;
    if (typeOfCustomer) {
      const newType = new TypeOfCustomer({ name: typeOfCustomer });
      await newType.save();
    }
    if (application) {
      const newApp = new Application({ name: application });
      await newApp.save();
    }
    if (sow) {
      const newSow = new SOW({ name: sow });
      await newSow.save();
    }
    if (brand) {
      const newBrand = new Brand({ name: brand });
      await newBrand.save();
    }
    res.status(200).json({ message: "Custom inputs added successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding custom inputs", error: error.message });
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
