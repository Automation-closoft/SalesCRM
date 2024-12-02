import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SalesReport.css";
import { jsPDF } from "jspdf";

const SalesReport = () => {
  const [reportType, setReportType] = useState("yearly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("Jan");
  const [quarter, setQuarter] = useState(1);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [dropdownData, setDropdownData] = useState({
    typeOfCustomers: [],
    applications: [],
    sows: [],
    brands: [],
  });

  const years = [2022, 2023, 2024, 2025];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const quarters = [1, 2, 3, 4];

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch("https://salescrm-backend.onrender.com/api/salesCRM/dropdowns");
        const data = await response.json();
        if (data.success) {
          setDropdownData({
            typeOfCustomers: data.typeOfCustomers,
            applications: data.applications,
            sows: data.sows,
            brands: data.brands,
          });
        } else {
          toast.error("Failed to fetch dropdown data.");
        }
      } catch (error) {
        toast.error("Error fetching dropdown data.");
      }
    };
    fetchDropdownData();
  }, []);

  const handleGenerateReport = async () => {
    const params = {
      reportType,
      year,
      month,
      quarter,
      customStartDate,
      customEndDate,
    };

    try {
      const response = await fetch("https://salescrm-backend.onrender.com/api/salesCRM/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (data.success) {
        generatePDF(data.report);
        toast.success("Report generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate report.");
      }
    } catch (error) {
      toast.error("Error generating report.");
    }
  };

  const generatePDF = (reportData) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Sales CRM Report", 14, 20);
    doc.setFontSize(12);

    let y = 40;
    reportData.forEach((entry, index) => {
      doc.text(`${index + 1}. ${entry.customerName} - ${entry.projectName} - ${entry.statusOfRFQ}`, 14, y);
      y += 10;
    });

    doc.save("sales_report.pdf");
  };

  return (
    <div className="report-container">
      <ToastContainer />
      <h2>Generate Sales Report</h2>

      <div>
        <label>Report Type: </label>
        <select onChange={(e) => setReportType(e.target.value)} value={reportType}>
          <option value="yearly">Yearly</option>
          <option value="half-year">Half Year</option>
          <option value="quarterly">Quarterly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {reportType === "yearly" && (
        <div>
          <label>Year: </label>
          <select onChange={(e) => setYear(e.target.value)} value={year}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}

      {reportType === "half-year" && (
        <div>
          <label>Year: </label>
          <select onChange={(e) => setYear(e.target.value)} value={year}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <label>Half Year: </label>
          <select onChange={(e) => setMonth(e.target.value)} value={month}>
            <option value="Jan">Jan - Jun</option>
            <option value="Jul">Jul - Dec</option>
          </select>
        </div>
      )}

      {reportType === "quarterly" && (
        <div>
          <label>Year: </label>
          <select onChange={(e) => setYear(e.target.value)} value={year}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <label>Quarter: </label>
          <select onChange={(e) => setQuarter(e.target.value)} value={quarter}>
            {quarters.map((q) => (
              <option key={q} value={q}>
                Q{q}
              </option>
            ))}
          </select>
        </div>
      )}

      {reportType === "custom" && (
        <div>
          <label>Start Date: </label>
          <input type="date" onChange={(e) => setCustomStartDate(e.target.value)} value={customStartDate} />
          <label>End Date: </label>
          <input type="date" onChange={(e) => setCustomEndDate(e.target.value)} value={customEndDate} />
        </div>
      )}

      <button onClick={handleGenerateReport}>Generate Report</button>
    </div>
  );
};

export default SalesReport;
