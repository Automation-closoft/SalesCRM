import React, { useState } from 'react';
import './Add.css';

function Add() {
  const initialOptions = {
    typeOfCustomer: [
      "MB - Machine Builders",
      "OEM/MFG - Original Equipment Manufacturer/Manufacturer",
      "PID - Process Industries",
      "TSC - Technology Service Companies",
      "PnC - Principals and Consultants",
      "PSI - Panel & System Integrators",
      "PSU - Public Sector Units",
      "EPC/MEP - Engineering Procurement Construction / Mechanical, Electrical, Plumbing",
    ],
    sow: [
      "Backend Development & Testing",
      "EMS (Shop Floor)",
      "EMS (Site)",
      "Engineering Design",
      "Consultant Documentation",
      "Project (E2E)",
      "Trading",
      "OD & STC",
    ],
    application: [
      "SG/DG Sync",
      "Testing Bench/EOL/SPM",
      "Water & WW Treatment",
      "Energy Management",
      "HVAC/BMS/CPM",
      "Discrete Manufacturing",
      "Metering Skids",
    ],
    brand: [
      "Siemens",
      "Schneider",
      "Rockwell",
      "Mitsubishi",
      "Delta",
      "Omron",
      "GE",
      "ABB",
      "Others",
    ],
    natureOfRFQ: [
      "Job in hand",
      "Ongoing",
      "Budgetary",
      "Bidding",
    ],
    statusOfRFQ: [
      "Yet to quote",
      "Req gathered",
      "Follow up"
    ]
  };

  const [formData, setFormData] = useState({
    customerName: '',
    rfqDate: '',
    typeOfCustomer: '',
    projectName: '',
    sow: '',
    quotedValue: '',
    currency: '',
    application: '',
    brand: '',
    natureOfRFQ: '',
    statusOfRFQ: '',
    remarks: '', 
  });

  const [customOptions, setCustomOptions] = useState(initialOptions);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCustomOption = async (name) => {
    const customValue = prompt(`Add a new ${name}:`);
    if (customValue && !customOptions[name].includes(customValue)) {
      try {
        setCustomOptions((prev) => ({
          ...prev,
          [name]: [...prev[name], customValue],
        }));

        await fetch(`http://localhost:4000/api/salesCRM/addCustomOption`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: name, value: customValue }),
        });

      } catch (err) {
        setError('Failed to add custom option. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/salesCRM/add", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Entry added!');
        setFormData({
          customerName: '',
          enquiryMonth: '',
          customerCategory: '',
          projectName: '',
          application: '',
          location: '',
          SOW: '',
          brand: '',
          value: '',
          expectedClosureMonth: '',
          forecastStatus: '',
          remarks: ''
        });
      } else {
        setError('Failed to add entry. Please check the data.');
      }
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div className="add-container">
      <h2>Sales CRM Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-row">
          <input
            name="customerName"
            placeholder="Customer Name"
            onChange={handleChange}
            value={formData.customerName}
            required
          />
          <input
            name="customerLocation"
            placeholder="Customer Location"
            onChange={handleChange}
            value={formData.customerocation}
            required
          />
          <input
            type="date"
            name="rfqDate"
            onChange={handleChange}
            value={formData.rfqDate}
            required
          />
        </div>

        <div className="form-row">
          <div className="select-container">
            <select
              name="typeOfCustomer"
              onChange={handleChange}
              value={formData.typeOfCustomer}
              required
            >
              <option value="">Select Type of Customer</option>
              {customOptions.typeOfCustomer.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => handleAddCustomOption('typeOfCustomer')}>+ Add</button>
          </div>

          <input
            name="projectName"
            placeholder="Project Name"
            onChange={handleChange}
            value={formData.projectName}
            required
          />
        </div>

        <div className="form-row">
          <div className="select-container">
            <select
              name="sow"
              onChange={handleChange}
              value={formData.sow}
              required
            >
              <option value="">Select SOW</option>
              {customOptions.sow.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => handleAddCustomOption('sow')}>+ Add</button>
          </div>

          <input
            name="quotedValue"
            placeholder="Quoted Value"
            type="number"
            onChange={handleChange}
            value={formData.quotedValue}
            required
          />
          <select
            name="currency"
            onChange={handleChange}
            value={formData.currency}
            required
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="AED">AED</option>
            <option value="SAR">SAR</option>
          </select>
        </div>

        <div className="form-row">
          <div className="select-container">
            <select
              name="application"
              onChange={handleChange}
              value={formData.application}
              required
            >
              <option value="">Select Application</option>
              {customOptions.application.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => handleAddCustomOption('application')}>+ Add</button>
          </div>
          <input
            type="date"
            name="expectedClosureMonth"
            onChange={handleChange}
            value={formData.expectedClosureMonth}
            placeholder='Expected Closure Date'
            required
          />

          <div className="select-container">
            <select
              name="brand"
              onChange={handleChange}
              value={formData.brand}
              required
            >
              <option value="">Select Brand</option>
              {customOptions.brand.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => handleAddCustomOption('brand')}>+ Add</button>
          </div>
        </div>

        <div className="form-row">
          <select
            name="natureOfRFQ"
            onChange={handleChange}
            value={formData.natureOfRFQ}
            required
          >
            <option value="">Nature of RFQ</option>
            {customOptions.natureOfRFQ.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            name="statusOfRFQ"
            onChange={handleChange}
            value={formData.statusOfRFQ}
            required
          >
            <option value="">Status of RFQ</option>
            {customOptions.statusOfRFQ.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="remarks"
          placeholder="Remarks"
          onChange={handleChange}
          rows="4"
          value={formData.remarks}
        />

        <div className="form-row">
          <button type="submit">Add Entry</button>
        </div>
      </form>
    </div>
  );
}

export default Add;
