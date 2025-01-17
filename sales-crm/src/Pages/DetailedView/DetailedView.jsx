  import React, { useState, useEffect } from "react";
  import { useParams } from "react-router-dom";
  import "./DetailedView.css";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  const apiUrl = import.meta.env.VITE_API_URL;

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
          const response = await fetch(
            "https://salescrm-backend.onrender.com/api/salesCRM/dropdowns"
          );
          if (response.ok) {
            const data = await response.json();

            setDropdownOptions({
              typeOfCustomer: data.typeOfCustomers?.map((item) => ({
                id: item._id,
                name: item.name,
              })) || [],
              application: data.application?.map((item) => ({
                id: item._id,
                name: item.name,
              })) || [],
              sow: data.sow?.map((item) => ({
                id: item._id,
                name: item.name,
              })) || [],
              brand: data.brand?.map((item) => ({
                id: item._id,
                name: item.name,
              })) || [],
            });
          } else {
            console.error("Failed to fetch dropdown data:", response.statusText);
          }
        } catch (err) {
          console.error("Error fetching dropdown data:", err);
        }
      };

      const fetchClient = async () => {
        try {
          const response = await fetch(
            `${apiUrl}/api/salesCRM/${clientId}`
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
        // Ensure no duplicates in the remarks before saving
        const updatedRemarks = [...new Set(client.remarks)];
    
        const response = await fetch(
          `${apiUrl}/api/salesCRM/update/${clientId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...client, remarks: updatedRemarks }),
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
    
      // Check if the new remark already exists in the current list
      if (client.remarks.includes(newRemark.trim())) {
        toast.error("This remark has already been added.");
        return;
      }
    
      // Add the new remark if it's unique
      const updatedRemarks = [...client.remarks, newRemark.trim()];
    
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
        setNewRemark("");
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
              <option key={type.id} value={type.name}>
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
              <option key={app.id} value={app.name}>
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
              <option key={sow.id} value={sow.name}>
                {sow.name}
              </option>
            ))}
          </select>

          <label>Brand:</label>
          <select name="brand" value={client.brand} onChange={handleInputChange}>
            {dropdownOptions.brand.map((brand) => (
              <option key={brand.id} value={brand.name}>
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
            {["INR", "AED", "USD", "QAR", "SAR", "OMR", "KWD", "NGN", "ZAR", "MGA", "BHD", "IRR", "IQD", "JOD", "LBP", "TRY", "YER"].map(
              (currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              )
            )}
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
            {["Requirement gathering", "Yet to Quote", "Quote Sent", "PO Follow-up", "Converted", "Lost"].map((status) => (
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
