import React, { useState } from 'react';
import './Add.css';

function Add() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerLocation: '',
    customerPOC: '',
    rfqDate: '',
    typeOfCustomer: '',
    projectName: '',
    sow: '',
    quotedValue: '',
    currency: '',
    application: '',
    brand: '',
    expectedClosureMonth: '',
    natureOfRFQ: '',
    statusOfRFQ: '',
    remarks: '',
  });

  const [customOptions, setCustomOptions] = useState({
    typeOfCustomer: [],
    application: [],
    sow: [],
    brand: [],
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchOptions = async (name) => {
    try {
      const response = await fetch(`https://salescrm-backend.onrender.com/api/${name}`);
      if (response.ok) {
        const data = await response.json();
        setCustomOptions((prev) => ({
          ...prev,
          [name]: data.map((item) => ({ id: item._id, name: item.name })),
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch ${name} options:`, err);
    }
  };

  const handleAddCustomOption = async (name) => {
    const customValue = prompt(`Add a new ${name}:`);
    if (customValue) {
      try {
        const response = await fetch(`https://salescrm-backend.onrender.com/api/salesCRM/add-custom-input`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [name]: customValue }),
        });
        if (response.ok) {
          alert(`${name} added successfully!`);
          fetchOptions(name); // Refresh the dropdown options
        } else {
          setError(`Failed to add new ${name}`);
        }
      } catch (err) {
        setError(`An error occurred while adding ${name}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://salescrm-backend.onrender.com/api/salesCRM/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Entry added successfully!');
        setFormData({
          customerName: '',
          customerLocation: '',
          customerPOC: '',
          rfqDate: '',
          typeOfCustomer: '',
          projectName: '',
          sow: '',
          quotedValue: '',
          currency: '',
          application: '',
          brand: '',
          expectedClosureMonth: '', // Reset expectedClosureMonth
          natureOfRFQ: '',
          statusOfRFQ: '',
          remarks: '',
        });
      } else {
        setError('Failed to add the entry. Please check the inputs.');
      }
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    }
  };

  React.useEffect(() => {
    ['typeOfCustomer', 'application', 'sow', 'brand'].forEach(fetchOptions);
  }, []);

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
            value={formData.customerLocation}
            required
          />
          <input
            name="customerPOC"
            placeholder="Customer Point of Contact"
            onChange={handleChange}
            value={formData.customerPOC}
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
              {customOptions.typeOfCustomer.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
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
            <select name="sow" onChange={handleChange} value={formData.sow} required>
              <option value="">Select SOW</option>
              {customOptions.sow.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => handleAddCustomOption('sow')}>+ Add</button>
          </div>

          <input
            name="quotedValue"
            type="number"
            placeholder="Quoted Value"
            onChange={handleChange}
            value={formData.quotedValue}
            required
          />
          <select name="currency" onChange={handleChange} value={formData.currency} required>
            <option value="">Select Currency</option>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="AED">AED</option>
            <option value="SAR">SAR</option>
          </select>
        </div>

        <div className="form-row">
          <div className="select-container">
            <select name="application" onChange={handleChange} value={formData.application} required>
              <option value="">Select Application</option>
              {customOptions.application.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => handleAddCustomOption('application')}>+ Add</button>
          </div>
          <div className="select-container">
            <select name="brand" onChange={handleChange} value={formData.brand} required>
              <option value="">Select Brand</option>
              {customOptions.brand.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => handleAddCustomOption('brand')}>+ Add</button>
          </div>
        </div>

        <div className="form-row">
          <input
            type="month"
            name="expectedClosureMonth"
            placeholder="Expected Closure Date"
            onChange={handleChange}
            value={formData.expectedClosureMonth}
            required
          />
        </div>

        <div className="form-row">
          <textarea
            name="remarks"
            placeholder="Remarks"
            onChange={handleChange}
            value={formData.remarks}
          />
          <button type="submit">Add Entry</button>
        </div>
      </form>
    </div>
  );
}

export default Add;
