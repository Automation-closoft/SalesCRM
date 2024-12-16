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
    sow: [],
    application: [],
    brand: [],
  });

  const [error, setError] = useState('');

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field is a dropdown, store the name of the selected option
    if (customOptions[name]) {
      const selectedOption = customOptions[name].find((option) => option.id === value);
      setFormData({
        ...formData,
        [name]: selectedOption ? selectedOption.name : '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const fetchDropdowns = async () => {
    try {
      const response = await fetch('https://salescrm-backend.onrender.com/api/salesCRM/dropdowns');
      if (response.ok) {
        const data = await response.json();
        setCustomOptions({
          typeOfCustomer: data.typeOfCustomers?.map((item) => ({
            id: item._id,
            name: item.name,
          })) || [],
          sow: data.sow?.map((item) => ({
            id: item._id,
            name: item.name,
          })) || [],
          application: data.application?.map((item) => ({
            id: item._id,
            name: item.name,
          })) || [],
          brand: data.brand?.map((item) => ({
            id: item._id,
            name: item.name,
          })) || [],
        });
      } else {
        console.error('Failed to fetch dropdown data:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
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
        const responseBody = await response.json();
        if (response.ok) {
          alert(`${name} added successfully!`);
          fetchDropdowns();
        } else {
          setError(`Failed to add new ${name}: ${responseBody.message || responseBody.error}`);
        }
      } catch (err) {
        setError(`An error occurred while adding ${name}: ${err.message}`);
      }
    }
  };  
  console.log('Request Body:', JSON.stringify(formData));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://salescrm-backend.onrender.com/api/salesCRM/add',{
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
          expectedClosureMonth: '',
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
    fetchDropdowns();
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
              {customOptions.sow?.map((option) => (
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
            <option value="AED">AED</option>
            <option value="USD">USD</option>
            <option value="QAR">QAR</option>
            <option value="SAR">SAR</option>
            <option value="OMR">OMR</option>
            <option value="KWD">KWD</option>
            <option value="NGN">NGN</option>
            <option value="ZAR">ZAR</option>
            <option value="MGA">MGA</option>
            <option value="BHD">BHD</option>
            <option value="IRR">IRR</option>
            <option value="IQD">IQD</option>
            <option value="JOD">JOD</option>
            <option value="LBP">LBP</option>
            <option value="TRY">TRY</option>
            <option value="YER">YER</option>
          </select>
        </div>
        <div className="form-row">
          <div className="select-container">
            <select name="application" onChange={handleChange} value={formData.application} required>
              <option value="">Select Application</option>
              {customOptions.application?.map((option) => (
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
              {customOptions.brand?.map((option) => (
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
          <label htmlFor="natureOfRFQ">Nature of RFQ</label>
          <select
            name="natureOfRFQ"
            value={formData.natureOfRFQ}
            onChange={handleChange}
            required
          >
            <option value="">Select Nature of RFQ</option>
            <option value="Job in hand">Job in hand</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Budgetary">Budgetary</option>
            <option value="Bidding">Bidding</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="statusOfRFQ">Status of RFQ</label>
          <select
            name="statusOfRFQ"
            value={formData.statusOfRFQ}
            onChange={handleChange}
            required
          >
            <option value="">Select Status of RFQ</option>
            <option value="Requirement Gathering">Requirement Gathering</option>
            <option value="Yet to Quote">Yet to Quote</option>
            <option value="Quote Sent">Quote Sent</option>
            <option value="PO Follow-up">PO Follow-up</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
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