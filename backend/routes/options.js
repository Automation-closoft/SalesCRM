import express from 'express';
import { TypeOfCustomer, Application, SOW, Brand } from '../models/crmModel.js';

const router = express.Router();

router.post("/save-options", async (req, res) => {
  try {
    const { category, options } = req.body;

    if (!category || !Array.isArray(options) || options.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input. 'category' and 'options' are required." });
    }

    let Model;
    switch (category) {
      case "applications":
        Model = Application;
        break;
      case "brands":
        Model = Brand;
        break;
      case "sow":
        Model = SOW;
        break;
      case "typeOfCustomers":
        Model = TypeOfCustomer;
        break;
      default:
        return res.status(400).json({ error: "Invalid category" });
    }

    const savedOptions = await Promise.all(
      options.map((option) =>
        Model.findOneAndUpdate(
          { name: option },
          { name: option },
          { upsert: true, new: true }
        )
      )
    );

    res.status(200).json({ message: "Options saved successfully", data: savedOptions });
  } catch (error) {
    console.error("Error saving options:", error.message);
    res.status(500).json({ error: "An error occurred while saving options" });
  }
});

export default router;
