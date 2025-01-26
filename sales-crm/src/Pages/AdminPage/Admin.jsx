import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./Admin.css";

const apiUrl = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [categories] = useState([
    { label: "Type of Customer", value: "typeOfCustomer" },
    { label: "Application", value: "application" },
    { label: "SOW", value: "sow" },
    { label: "Brand", value: "brand" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customOptions, setCustomOptions] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/salesCRM/dropdowns`);
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
        console.error("Failed to fetch dropdown data:", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  const handleDelete = async (name) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${apiUrl}/api/salesCRM/dropdown/${selectedCategory}/${name}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        alert("Item deleted successfully!");
        fetchDropdowns(); // Refresh the dropdown values
      } else {
        console.error("Failed to delete item:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const currentOptions = selectedCategory
    ? customOptions[selectedCategory] || []
    : [];

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      <div className="dropdown-container">
        <label htmlFor="category-select">Select Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedValue(""); // Reset selected value when category changes
          }}
        >
          <option value="">-- Select Category --</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className="dropdown-container">
          <label htmlFor="value-select">Select Value:</label>
          <select
            id="value-select"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="">-- Select Value --</option>
            {currentOptions.length > 0 ? (
              currentOptions.map((value) => (
                <option key={value.id} value={value.name}>
                  {value.name}
                </option>
              ))
            ) : (
              <option disabled>No values available</option>
            )}
          </select>
        </div>
      )}

      {selectedValue && (
        <div>
          <img
            src={assets.del}
            alt="Delete"
            onClick={() => handleDelete(selectedValue)} // Passing the name to delete
            className="delete-icon"
          />
        </div>
      )}
    </div>
  );
};

export default Admin;
