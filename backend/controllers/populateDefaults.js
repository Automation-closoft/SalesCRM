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
    // Destructure and validate required fields
    const { customerName, rfqDate, projectName, remarks } = req.body;

    if (!customerName || !rfqDate || !projectName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (customerName, rfqDate, projectName)",
      });
    }

    // Validate RFQ date
    if (isNaN(Date.parse(rfqDate))) {
      return res.status(400).json({
        success: false,
        message: "Invalid RFQ date format",
      });
    }

    // Sanitize remarks to ensure it's an array of objects
    const sanitizedRemarks = Array.isArray(remarks)
      ? remarks.map((remark) => ({
          remark: (remark.remark || "No remark provided").trim(),
        }))
      : [];

    // Create a new client document
    const client = new SalesCrm({
      customerName,
      customerLocation: req.body.customerLocation,
      customerPOC: req.body.customerPOC,
      rfqDate,
      typeOfCustomer: req.body.typeOfCustomer,
      projectName,
      sow: req.body.sow,
      quotedValue: req.body.quotedValue,
      currency: req.body.currency,
      application: req.body.application,
      expectedClosureMonth: req.body.expectedClosureMonth,
      brand: req.body.brand,
      natureOfRFQ: req.body.natureOfRFQ,
      statusOfRFQ: req.body.statusOfRFQ,
      remarks: sanitizedRemarks,
    });

    // Save client to the database
    const savedClient = await client.save();

    res.status(201).json({
      success: true,
      message: "Client added successfully!",
      data: savedClient,
    });
  } catch (error) {
    console.error("Error while adding client:", {
      body: req.body,
      error: error.message,
    });

    res.status(500).json({
      success: false,
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
      return res.status(400).json({ success: false, message: "Invalid client ID format" });
    }

    const updateFields = {};
    if (statusOfRFQ !== undefined) updateFields.statusOfRFQ = statusOfRFQ;
    if (customerLocation !== undefined) updateFields.customerLocation = customerLocation;
    if (quotedValue !== undefined) updateFields.quotedValue = quotedValue;

    // Overwrite the remarks field if provided
    if (remarks && Array.isArray(remarks)) {
      updateFields.remarks = remarks.map((remark) => ({
        remark: remark.remark || "No remark provided",
      }));
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided for update" });
    }

    const updatedClient = await SalesCrm.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!updatedClient) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update client details",
      error: error.message,
    });
  }
};

const updateClientRemarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (!remarks || !Array.isArray(remarks)) {
      return res.status(400).json({ success: false, message: "Remarks should be an array" });
    }

    const sanitizedRemarks = remarks.map((remark) => ({
      remark: remark.remark || "No remark provided",
    }));

    const updatedClient = await SalesCrm.findByIdAndUpdate(
      id,
      { $set: { remarks: sanitizedRemarks } }, // Overwrite the remarks field
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update client remarks",
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

const deleteDropdownValue = async (req, res) => {
  const { category, name } = req.params;

  console.log("Received DELETE request for category:", category, "Name:", name);

  // Map categories to their corresponding models
  const categoryModelMap = {
      typeOfCustomer: TypeOfCustomer,
      application: Application,
      sow: SOW,
      brand: Brand,
  };

  // Retrieve the model corresponding to the category
  const Model = categoryModelMap[category];

  if (!Model) {
      console.log("Invalid category received:", category);
      return res.status(400).json({
          success: false,
          message: "Invalid category specified",
      });
  }

  try {
      // Attempt to find and delete the item by name
      const deletedItem = await Model.findOneAndDelete({ name: name });

      if (!deletedItem) {
          console.log(`${category} item with name "${name}" not found`);
          return res.status(404).json({
              success: false,
              message: `${category} item with name "${name}" not found`,
          });
      }

      console.log(`${category} item with name "${name}" deleted successfully`);
      res.status(200).json({
          success: true,
          message: `${category} item deleted successfully`,
          deletedItem,
      });
  } catch (err) {
      console.error("Error deleting dropdown value:", err);
      res.status(500).json({
          success: false,
          message: "Error deleting dropdown value",
      });
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


const generateCustomerTypeReport = async (req, res) => {
  try {
    const { typeOfCustomer } = req.body;

    if (!typeOfCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer type is required for generating the report.",
      });
    }

    // Query to filter by typeOfCustomer
    const query = { typeOfCustomer };

    const report = await SalesCrm.find(query);

    if (report.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the selected customer type.",
      });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Error generating customer type report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report for customer type.",
    });
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
  generateCustomerTypeReport,
  deleteDropdownValue,
  updateClientRemarks,
};
