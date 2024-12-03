import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DetailedView.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailedView = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [newRemark, setNewRemark] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState({
    typeOfCustomer: [],
    application: [],
    sow: [],
    brand: [],
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [typeRes, appRes, sowRes, brandRes] = await Promise.all([
          fetch("https://salescrm-backend.onrender.com/api/typeOfCustomer"),
          fetch("https://salescrm-backend.onrender.com/api/application"),
          fetch("https://salescrm-backend.onrender.com/api/sow"),
          fetch("https://salescrm-backend.onrender.com/api/brand"),
        ]);
        const typeData = await typeRes.json();
        const appData = await appRes.json();
        const sowData = await sowRes.json();
        const brandData = await brandRes.json();

        setDropdownOptions({
          typeOfCustomer: typeData,
          application: appData,
          sow: sowData,
          brand: brandData,
        });
      } catch (error) {
        toast.error("Failed to fetch dropdown options.");
      }
    };

    const fetchClient = async () => {
      try {
        const response = await fetch(
          `https://salescrm-backend.onrender.com/api/salesCRM/${clientId}`
        );
        if (!response.ok) throw new Error("Failed to fetch client details");
        const data = await response.json();
        setClient(data);
      } catch (error) {
        toast.error("Error fetching client details.");
      }
    };

    fetchDropdowns();
    fetchClient();
  }, [clientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `https://salescrm-backend.onrender.com/api/salesCRM/update/${clientId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client),
        }
      );
      if (!response.ok) throw new Error("Failed to update client details");
      toast.success("Client details updated successfully.");
    } catch (error) {
      toast.error("Error updating client details.");
    }
  };

  const handleAddRemark = async () => {
    if (!newRemark.trim()) {
      toast.error("Remark cannot be empty.");
      return;
    }
    const updatedRemarks = [...client.remarks, newRemark];
    try {
      const response = await fetch(
        `https://salescrm-backend.onrender.com/api/salesCRM/update/${clientId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ remarks: updatedRemarks }),
        }
      );
      if (!response.ok) throw new Error("Failed to add remark");
      setClient((prevClient) => ({
        ...prevClient,
        remarks: updatedRemarks,
      }));
      setNewRemark(""); // Clear the input field for new remark
      toast.success("Remark added successfully.");
    } catch (error) {
      toast.error("Error adding remark.");
    }
  };
  
  if (!client) {
    return <p>Loading client details...</p>;
  }

  return (
    <div className="detailed-container">
      <ToastContainer />
      <h2>Client Detailed View</h2>
      <div className="detail-form">
        <label>Customer Name:</label>
        <input
          type="text"
          name="customerName"
          value={client.customerName}
          onChange={handleInputChange}
        />

        <label>Type of Customer:</label>
        <select
          name="typeOfCustomer"
          value={client.typeOfCustomer}
          onChange={handleInputChange}
        >
          {dropdownOptions.typeOfCustomer.map((type) => (
            <option key={type._id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>

        <label>Project Name:</label>
        <input
          type="text"
          name="projectName"
          value={client.projectName}
          onChange={handleInputChange}
        />

        <label>Application:</label>
        <select
          name="application"
          value={client.application}
          onChange={handleInputChange}
        >
          {dropdownOptions.application.map((app) => (
            <option key={app._id} value={app.name}>
              {app.name}
            </option>
          ))}
        </select>

        <label>Location:</label>
        <input
          type="text"
          name="customerLocation"
          value={client.customerLocation}
          onChange={handleInputChange}
        />

        <label>SOW:</label>
        <select name="sow" value={client.sow} onChange={handleInputChange}>
          {dropdownOptions.sow.map((sow) => (
            <option key={sow._id} value={sow.name}>
              {sow.name}
            </option>
          ))}
        </select>

        <label>Brand:</label>
        <select name="brand" value={client.brand} onChange={handleInputChange}>
          {dropdownOptions.brand.map((brand) => (
            <option key={brand._id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>

        <label>Quoted Value:</label>
        <input
          type="number"
          name="quotedValue"
          value={client.quotedValue}
          onChange={handleInputChange}
        />

        <label>Currency:</label>
        <select
          name="currency"
          value={client.currency}
          onChange={handleInputChange}
        >
          {[
            "INR",
            "AED",
            "USD",
            "QAR",
            "SAR",
            "OMR",
            "KWD",
            "NGN",
            "ZAR",
            "MGA",
            "BHD",
            "IRR",
            "IQD",
            "JOD",
            "LBP",
            "TRY",
            "YER",
          ].map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <label>Nature of RFQ:</label>
        <select
          name="natureOfRFQ"
          value={client.natureOfRFQ}
          onChange={handleInputChange}
        >
          {["Job in hand", "Ongoing", "Budgetary", "Bidding"].map((nature) => (
            <option key={nature} value={nature}>
              {nature}
            </option>
          ))}
        </select>

        <label>Status of RFQ:</label>
        <select
          name="statusOfRFQ"
          value={client.statusOfRFQ}
          onChange={handleInputChange}
        >
          {["Yet to quote", "Req gathered", "Follow up"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button className="save-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      <div className="remarks-section">
        <h3>Remarks</h3>
        <ul>
          {client.remarks.map((remark, index) => (
            <li key={index}>{remark}</li>
          ))}
        </ul>
        <textarea
          placeholder="Add a new remark"
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
        />
        <button className="add-remark-button" onClick={handleAddRemark}>
          Add Remark
        </button>
      </div>
    </div>
  );
};

export default DetailedView;
