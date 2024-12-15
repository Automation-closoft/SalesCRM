import mongoose from "mongoose";
const dropdownSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
});
const TypeOfCustomer = mongoose.model("TypeOfCustomer", dropdownSchema, "typeOfCustomers");
const Application = mongoose.model("Application", dropdownSchema, "applications");
const SOW = mongoose.model("SOW", dropdownSchema, "sow");
const Brand = mongoose.model("Brand", dropdownSchema, "brands");
const salesCrmSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  customerLocation: { type: String, required: true },
  customerPOC: { type: String, required: true },
  rfqDate: { type: Date, required: true },
  typeOfCustomer: { type: mongoose.Schema.Types.ObjectId, ref: "TypeOfCustomer", required: true },
  projectName: { type: String, required: true },
  sow: { type: mongoose.Schema.Types.ObjectId, ref: "SOW", required: true },
  quotedValue: { type: Number, required: true },
  currency: {
    type: String,
    enum: ["INR", "AED", "USD", "QAR", "SAR", "OMR", "KWD", "NGN", "ZAR", "MGA", "BHD", "IRR", "IQD", "JOD", "LBP", "TRY", "YER"],
    required: true,
  },
  applications: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  brands: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  expectedClosureMonth: { type: String, required: true },
  natureOfRFQ: {
    type: String,
    enum: ["Job in hand", "Ongoing", "Budgetary", "Bidding"],
    required: true,
  },
  statusOfRFQ: {
    type: String,
    enum: ["Requirement Gathering","Yet to Quote","Quote Sent","PO Follow-up","Converted","Lost"],
    required: true,
  },
  remarks: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});
salesCrmSchema.index({ customerName: 1 });
salesCrmSchema.index({ rfqDate: 1 });
salesCrmSchema.index({ typeOfCustomer: 1 });
salesCrmSchema.index({ application: 1 });
const SalesCrm = mongoose.models.SalesCrm || mongoose.model("SalesCrm", salesCrmSchema);
export { SalesCrm, TypeOfCustomer, Application, SOW, Brand };