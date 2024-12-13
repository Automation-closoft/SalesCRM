import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./SalesReport.css";

const SalesReport = ({ onReportGenerated }) => {
  const [reportType, setReportType] = useState("yearly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("Jan");
  const [quarter, setQuarter] = useState(1);
  const [halfYear, setHalfYear] = useState(1);  
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [dropdownData, setDropdownData] = useState({
    typeOfCustomers: [],
    applications: [],
    sows: [],
    brands: [],
  });

  const years = [2022, 2023, 2024, 2025];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const quarters = [1, 2, 3, 4];

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(
          "https://salescrm-backend.onrender.com/api/salesCRM/dropdowns"
        );
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
    if (reportType === "custom" && (!customStartDate || !customEndDate)) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (reportType !== "custom" && !year) {
      toast.error("Please select a year.");
      return;
    }

    const params = {
      reportType,
      year,
      month,
      quarter,
      halfYear,
      customStartDate,
      customEndDate,
    };

    try {
      const response = await fetch(
        "https://salescrm-backend.onrender.com/api/salesCRM/report",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        }
      );
      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(`API Error: ${errorMessage}`);
        console.error("API Error:", errorMessage);
        return;
      }
      const data = await response.json();
      console.log("API Response Data:", data);
      if (data.success) {
        generatePDF(data.report);
        toast.success("Report generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate report.");
        console.error("Error response:", data);
      }
    } catch (error) {
      toast.error("Error generating report.");
      console.error("Fetch error:", error);
    }
  };
  const generatePDF = (reportData) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Sales CRM Report", 14, 20);
    doc.setFontSize(12);
    let y = 40;
    doc.text("1. Executive Summary", 14, y);
    y += 10;
    doc.text(
      `Report Period: ${customStartDate || "MM/DD/YYYY"} - ${customEndDate || "MM/DD/YYYY"}`,
      14,
      y
    );
    y += 10;
    const totalRFQs = reportData.length;
    const totalQuotedValue = reportData.reduce(
      (acc, entry) => acc + entry.quotedValue,
      0
    );
    const totalConvertedRFQs = reportData.filter(
      (entry) => entry.statusOfRFQ === "Converted"
    ).length;
    const totalLostRFQs = reportData.filter(
      (entry) => entry.statusOfRFQ === "Lost"
    ).length;
    doc.text(`Total RFQs: ${totalRFQs}`, 14, y);
    y += 10;
    doc.text(`Total Quoted Value: ₹${totalQuotedValue}`, 14, y);
    y += 10;
    doc.text(`Converted RFQs: ${totalConvertedRFQs}`, 14, y);
    y += 10;
    doc.text(`Lost RFQs: ${totalLostRFQs}`, 14, y);
    y += 20;
    doc.text("2. Key Metrics Overview", 14, y);
    y += 10;
    doc.autoTable({
      head: [["Metric", "Value"]],
      body: [
        ["Total Customers Engaged", reportData.length],
        ["Total Projects", new Set(reportData.map(entry => entry.projectName)).size],
        ["Average Quoted Value", `₹${(totalQuotedValue / totalRFQs).toFixed(2)}`],
        ["RFQs by Status", ""],
      ],
      startY: y,
    });
    y += 30;
    doc.text("3. RFQ Details", 14, y);
    y += 10;
    doc.autoTable({
      head: [
        [
          "Customer Name",
          "Project Name",
          "RFQ Date",
          "Type of Customer",
          "SOW",
          "Quoted Value",
          "Status",
        ],
      ],
      body: reportData.map((entry) => [
        entry.customerName,
        entry.projectName,
        entry.rfqDate,
        entry.typeOfCustomer,
        entry.sow,
        `₹${entry.quotedValue}`,
        entry.statusOfRFQ,
      ]),
      startY: y,
    });
    const pdfName = `sales_report_${new Date().toISOString()}.pdf`;
    doc.save(pdfName);
    onReportGenerated();
  };
  return (
    <div className="sales-report">
      <h1>Generate Sales Report</h1>
      <div className="form-group">
        <label htmlFor="reportType">Report Type</label>
        <select
          id="reportType"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="yearly">Yearly</option>
          <option value="half-yearly">Half-Yearly</option>
          <option value="quarterly">Quarterly</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {reportType === "yearly" && (
        <div className="form-group">
          <label htmlFor="year">Select Year</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
      {reportType === "quarterly" && (
        <div className="form-group">
          <label htmlFor="quarter">Select Quarter</label>
          <select
            id="quarter"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
            {quarters.map((qtr) => (
              <option key={qtr} value={qtr}>
                Quarter {qtr}
              </option>
            ))}
          </select>
        </div>
      )}
      {reportType === "half-yearly" && (
        <div className="form-group">
          <label htmlFor="half-year">Select Half-Year</label>
          <select
            id="half-year"
            value={halfYear}
            onChange={(e) => setHalfYear(e.target.value)}
          >
            <option value="1">First Half (Jan - Jun)</option>
            <option value="2">Second Half (Jul - Dec)</option>
          </select>
        </div>
      )}
      {reportType === "custom" && (
        <>
          <div className="form-group">
            <label htmlFor="customStartDate">Start Date</label>
            <input
              type="date"
              id="customStartDate"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="customEndDate">End Date</label>
            <input
              type="date"
              id="customEndDate"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
            />
          </div>
        </>
      )}
      <button onClick={handleGenerateReport}>Generate Report</button>
      <ToastContainer />
    </div>
  );
};
export default SalesReport;
