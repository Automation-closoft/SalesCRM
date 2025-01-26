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
          `${apiUrl}/api/salesCRM/dropdowns`
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
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };
  
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/salesCRM/update/${clientId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client), // Send the updated client object, including remarks
        }
      );
  
      if (!response.ok) throw new Error("Failed to update client details");
      toast.success("Client details updated successfully.");
    } catch (error) {
      toast.error("Error updating client details.");
    }
  };
  
    const handleAddRemark = async () => {
      if (newRemark.trim()) {
        const existingRemarks = client.remarks.map(remark => remark.remark);
        if (!existingRemarks.includes(newRemark.trim())) {
          const updatedRemarks = [
            ...client.remarks,  // Keep existing remarks
            { remark: newRemark.trim() },  // Add new remark
          ];
    
          // Update the local state
          setClient({ ...client, remarks: updatedRemarks });
    
          // Send the updated client details to the backend
          await handleSaveChanges();
    
          // Clear the new remark input field
          setNewRemark('');
        } else {
          alert("This remark already exists.");
        }
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
          readOnly // Makes the field read-only
        />

        <label>Type of Customer:</label>
        <select
          name="typeOfCustomer"
          value={client.typeOfCustomer}
          disabled // Disables the dropdown
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
          readOnly // Makes the field read-only
        />

        <label>Application:</label>
        <select
          name="application"
          value={client.application}
          disabled // Disables the dropdown
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
          readOnly // Makes the field read-only
        />

        <label>SOW:</label>
        <select
          name="sow"
          value={client.sow}
          disabled // Disables the dropdown
        >
          {dropdownOptions.sow.map((sow) => (
            <option key={sow.id} value={sow.name}>
              {sow.name}
            </option>
          ))}
        </select>

        <label>Brand:</label>
        <select
          name="brand"
          value={client.brand}
          disabled // Disables the dropdown
        >
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
          readOnly // Makes the field read-only
        />

        <label>Currency:</label>
        <select
          name="currency"
          value={client.currency}
          disabled // Disables the dropdown
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
          onChange={handleInputChange} // Editable
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
          onChange={handleInputChange} // Editable
        >
          {["Requirement gathering", "Yet to Quote", "Quote Sent", "PO Follow-up", "Converted", "Lost"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

      </div>

      <div className="remarks-section">
    <h3>Remarks</h3>
    <ul>
      {client.remarks && client.remarks.length > 0 ? (
        client.remarks.map((remark, index) => (
          <li key={index}>{remark.remark || "No remark provided"}</li>
        ))
      ) : (
        <li>No remarks available</li>
      )}
    </ul>

    <textarea
      placeholder="Add a new remark"
      value={newRemark}
      onChange={(e) => setNewRemark(e.target.value)}
    />


<button className="save-button" onClick={handleAddRemark}>
          Add Remark
        </button>
  </div>
        <button className="save-button" onClick={handleSaveChanges}>
          Save Changes
        </button>

    </div>
  );
};

export default DetailedView;
