import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListView.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const apiUrl = import.meta.env.VITE_API_URL;


const ListView = () => {
  const [clients, setClients] = useState([]);
  const [statuses] = useState(["Requirement gathering","Yet to Quote", "Quote Sent", "PO Follow-up","Converted","Lost"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/salesCRM/all`
        );
        if (!response.ok) throw new Error("Failed to fetch client data");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        toast.error("Error fetching client data.");
      }
    };
    fetchClients();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/salesCRM/update/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statusOfRFQ: newStatus }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === id ? { ...client, statusOfRFQ: newStatus } : client
        )
      );
      toast.success("Status updated successfully.");
    } catch (error) {
      toast.error("Error updating status.");
    }
  };

  const handleDeleteClient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `${apiUrl}/api/salesCRM/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete client");
      setClients((prevClients) => prevClients.filter((client) => client._id !== id));
      toast.success("Client deleted successfully.");
    } catch (error) {
      toast.error("Error deleting client.");
    }
  };

  return (
    <div className="list-container">
      <ToastContainer />
      <h2>Client List</h2>
      <table className="client-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Enquiry Month</th>
            <th>Customer Name</th>
            <th>Customer Category</th>
            <th>Customer Point Of Contact</th>
            <th>Project Name</th>
            <th>Application</th>
            <th>Location</th>
            <th>SOW</th>
            <th>Brand</th>
            <th>Values in Rs</th>
            <th>Expected Closure Month</th>
            <th>Forecast Status</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {clients.map((client, index) => (
    <tr
      key={client._id}
      className="client-row"
      onClick={() => navigate(`/details/${client._id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{index + 1}</td>
      <td>
        {new Date(client.rfqDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </td>
      <td>{client.customerName}</td>
      <td>{client.typeOfCustomer}</td>
      <td>{client.customerPOC}</td>
      <td>{client.projectName}</td>
      <td>{client.application}</td>
      <td>{client.customerLocation || "N/A"}</td>
      <td>{client.sow}</td>
      <td>{client.brand}</td>
      <td>
        {client.quotedValue.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        })}
      </td>
      <td>{client.expectedClosureMonth || "N/A"}</td>
      <td>
        <select
          value={client.statusOfRFQ}
          onClick={(e) => e.stopPropagation()} 
          onChange={(e) => handleStatusChange(client._id, e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
      <td>{client.remarks.length > 0 ? client.remarks[client.remarks.length - 1] : "N/A"}</td>
      <td>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the row click
            handleDeleteClient(client._id);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default ListView;
