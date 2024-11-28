import React, { useEffect, useState } from 'react';
import './ListView.css'; // CSS for styling the table
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListView = () => {
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/salesCRM/all');
        if (!response.ok) throw new Error('Failed to fetch client data');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        toast.error('Error fetching client data: ' + error.message);
      }
    };
    fetchClients();
  }, []);

  

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
            <th>Project Name</th>
            <th>Application</th>
            <th>Location</th>
            <th>SOW</th>
            <th>Brand</th>
            <th>Values in Rs</th>
            <th>Expected Closure Month</th>
            <th>Forecast Status</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={client._id}>
              <td>{index + 1}</td>
              <td>{new Date(client.rfqDate).toLocaleString('default', { month: 'long', year: 'numeric' })}</td>
              <td>{client.customerName}</td>
              <td>{client.typeOfCustomer}</td>
              <td>{client.projectName}</td>
              <td>{client.application}</td>
              <td>{client.customerLocation || "N/A"}</td>
              <td>{client.sow}</td>
              <td>{client.brand}</td>
              <td>{client.quotedValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
              <td>{client.expectedClosureMonth || "N/A"}</td>
              <td>{client.statusOfRFQ}</td>
              <td>{client.remarks.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ListView;