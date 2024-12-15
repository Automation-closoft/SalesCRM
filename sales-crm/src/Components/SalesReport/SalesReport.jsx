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
  const [reportData, setReportData] = useState(null); // Store report data for display

  const years = [2022, 2023, 2024, 2025];
  const quarters = [1, 2, 3, 4];

  const handleGenerateReport = async () => {
    if (reportType === "custom" && (!customStartDate || !customEndDate)) {
      toast.error("Please select both start and end dates.");
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
        return;
      }

      const data = await response.json();
      if (data.success && data.report.length > 0) {
        setReportData(data.report); // Set report data for display
        toast.success("Report generated successfully!");
      } else {
        toast.error(data.message || "No data available for the selected criteria.");
      }
    } catch (error) {
      toast.error("Error generating report.");
    }
  };

  const downloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Sales CRM Report", 14, 20);
    doc.setFontSize(12);
    let y = 40;

    // Executive Summary
    doc.text("1. Executive Summary", 14, y);
    y += 10;

    const totalRFQs = reportData.length;
    const totalQuotedValue = reportData.reduce(
      (acc, entry) => acc + (entry.quotedValue || 0),
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

    // RFQ Details
    doc.text("2. RFQ Details", 14, y);
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
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
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
          <label htmlFor="halfYear">Select Half-Year</label>
          <select id="halfYear" value={halfYear} onChange={(e) => setHalfYear(e.target.value)}>
            <option value={1}>Jan - Jun</option>
            <option value={2}>Jul - Dec</option>
          </select>
        </div>
      )}

      {reportType === "custom" && (
        <div>
          <label htmlFor="customStartDate">Start Date</label>
          <input
            type="date"
            id="customStartDate"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />

          <label htmlFor="customEndDate">End Date</label>
          <input
            type="date"
            id="customEndDate"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleGenerateReport}>Generate Report</button>

      {reportData && (
        <div className="report-display">
          <h2>Generated Report</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Project Name</th>
                <th>RFQ Date</th>
                <th>Type of Customer</th>
                <th>SOW</th>
                <th>Quoted Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.customerName}</td>
                  <td>{entry.projectName}</td>
                  <td>{entry.rfqDate}</td>
                  <td>{entry.typeOfCustomer}</td>
                  <td>{entry.sow}</td>
                  <td>₹{entry.quotedValue}</td>
                  <td>{entry.statusOfRFQ}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadPDF}>Download Report</button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default SalesReport;
