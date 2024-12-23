import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./SalesReport.css";
import logo from "../../assets/logo.png";
const apiUrl = import.meta.env.VITE_API_URL;
const SalesReport = ({ onReportGenerated }) => {
  const [reportType, setReportType] = useState("yearly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("Jan");
  const [quarter, setQuarter] = useState(1);
  const [halfYear, setHalfYear] = useState(1);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const quarters = [1, 2, 3, 4];
  const [filterType, setFilterType] = useState('date');
  const [typeOfCustomer, setTypeOfCustomer] = useState();
  const [typeOfCustomerOptions, setTypeOfCustomerOptions] = useState([]);

  const fetchDropdowns = async () => {
    try {
      if (filterType === 'typeOfCustomer') {
        const response = await fetch(`${apiUrl}/api/salesCRM/dropdowns`);
        if (response.ok) {
          const data = await response.json();
          setTypeOfCustomerOptions(data.typeOfCustomers || []);
        } else {
          console.error('Failed to fetch dropdown data:', response.statusText);
        }
      }
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const calculateMetrics = (data) => {
    const totalRFQs = data.length;
    const totalQuotedValue = data.reduce(
      (acc, entry) => acc + (entry.quotedValue || 0),
      0
    );
    const totalConvertedRFQs = data.filter(
      (entry) => entry.statusOfRFQ === "Converted"
    ).length;
    const totalLostRFQs = data.filter(
      (entry) => entry.statusOfRFQ === "Lost"
    ).length;
    const uniqueCustomers = new Set(data.map((entry) => entry.customerName));
    const totalCustomersEngaged = uniqueCustomers.size;
    const uniqueProjects = new Set(data.map((entry) => entry.projectName));
    const totalProjects = uniqueProjects.size;
    const averageQuotedValue = totalRFQs > 0 ? totalQuotedValue / totalRFQs : 0;
    return {
      totalRFQs,
      totalQuotedValue,
      totalConvertedRFQs,
      totalLostRFQs,
      totalCustomersEngaged,
      totalProjects,
      averageQuotedValue,
    };
  };

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

    let endpoint = `${apiUrl}/api/salesCRM/report`;
    if (filterType === "typeOfCustomer") {
      endpoint = `${apiUrl}/api/salesCRM/customer-type-report`;
      if (typeOfCustomer && typeOfCustomer !== "all") {
        params.typeOfCustomer = typeOfCustomer;
      }
    }
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(`API Error: ${errorMessage}`);
        return;
      }
      const data = await response.json();
      if (data.success && data.report.length > 0) {
        setReportData(data.report);
        toast.success("Report generated successfully!");
      } else {
        toast.error(data.message || "No data available for the selected criteria.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report. Please try again later.");
    }
  };

  const downloadCSV = () => {
    if (!reportData || reportData.length === 0) {
      toast.error("No report data to download.");
      return;
    }

    // Metrics calculated earlier
    const metrics = calculateMetrics(reportData);

    // Executive Summary and Key Metrics
    const summary = [
      ["Executive Summary"],
      [`Total RFQs: ${metrics.totalRFQs}`],
      [`Total Quoted Value: Rs${metrics.totalQuotedValue.toLocaleString()}`],
      [`Converted RFQs: ${metrics.totalConvertedRFQs}`],
      [`Lost RFQs: ${metrics.totalLostRFQs}`],
      [`Total Customers Engaged: ${metrics.totalCustomersEngaged}`],
      [`Total Projects: ${metrics.totalProjects}`],
      [`Average Quoted Value: Rs${metrics.averageQuotedValue.toFixed(2)}`],
      [""], // Empty row for separation
    ];

    // Define headers for the detailed RFQ data
    const headers = [
      "Customer Name",
      "Project Name",
      "RFQ Date",
      "Quoted Value (Rs)",
      "Status",
    ];

    const rows = reportData.map((entry) => [
      `"${entry.customerName || "N/A"}"`,
      `"${entry.projectName || "N/A"}"`,
      `"${entry.rfqDate ? new Date(entry.rfqDate).toLocaleDateString() : "N/A"}"`,
      `"${entry.quotedValue !== undefined ? entry.quotedValue.toLocaleString() : "N/A"}"`,
      `"${entry.statusOfRFQ || "N/A"}"`,
    ]);
    const csvContent =
      summary.map((row) => row.join(",")).join("\n") +
      "\n" +
      [headers.join(",")].concat(rows.map((row) => row.join(","))).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const currentDate = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `Sales_Report_${currentDate}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Watermark configuration
    const imgWidth = 100;
    const imgHeight = 100;
    const watermarkX = (pageWidth - imgWidth) / 2;
    const watermarkY = (pageHeight - imgHeight) / 2;
    const watermarkOpacity = 0.02; // Reduced opacity for watermark

    // Add watermark image with transparency
    doc.addImage(logo, "PNG", watermarkX, watermarkY, imgWidth, imgHeight, "", "FAST");
    doc.setFillColor(255, 255, 255, watermarkOpacity);

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(14); // Reduced font size
    doc.text("Sales CRM Report", pageWidth / 2, 20, { align: "center" });

    // Executive Summary
    let y = 40;
    doc.setFont("times", "bold");
    doc.setFontSize(12); // Reduced section header font size
    doc.text("1. Executive Summary", 14, y);
    y += 8;

    const metrics = calculateMetrics(reportData);

    // Render metrics
    doc.setFont("times", "normal");
    doc.setFontSize(10); // Reduced font size for text
    doc.text(`• Total RFQs: ${metrics.totalRFQs}`, 14, y);
    y += 6;
    doc.text(`• Total Quoted Value: Rs${metrics.totalQuotedValue.toLocaleString()}`, 14, y);
    y += 6;
    doc.text(`• Converted RFQs: ${metrics.totalConvertedRFQs}`, 14, y);
    y += 6;
    doc.text(`• Lost RFQs: ${metrics.totalLostRFQs}`, 14, y);
    y += 15;

    // RFQ Details Section
    doc.setFont("times", "bold");
    doc.setFontSize(12); // Reduced section header font size
    doc.text("2. RFQ Details", 14, y);
    y += 8;

    // Column headers
    const headers = [
      "Customer Name",
      "Project Name",
      "RFQ Date",
      "Quoted Value (Rs)",
      "Status",
    ];

    const colWidths = [40, 55, 30, 30, 30]; // Adjusted column widths
    let x = 14; // Starting X position for headers
    doc.setFontSize(10);

    headers.forEach((header, index) => {
      doc.text(header, x, y);
      x += colWidths[index];
    });

    y += 6;

    // Table content
    doc.setFont("times", "normal");
    reportData.forEach((entry) => {
      x = 14;
      const row = [
        entry.customerName,
        entry.projectName,
        new Date(entry.rfqDate).toLocaleDateString(),
        `${entry.quotedValue.toLocaleString()}`,
        entry.statusOfRFQ,
      ];
      row.forEach((cell, index) => {
        doc.text(`${cell}`, x, y);
        x += colWidths[index];
      });
      y += 6;

      if (y > pageHeight - 20) {
        // Add new page if space runs out
        doc.addPage();

        // Reapply watermark on new page
        doc.addImage(logo, "PNG", watermarkX, watermarkY, imgWidth, imgHeight, "", "FAST");
        y = 20;
      }
    });

    // Add Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("times", "italic");
      doc.setFontSize(8); // Reduced footer font size
      doc.setTextColor(150);
      const footerText = `Page ${i} of ${pageCount}`;
      const dateText = `Generated on ${new Date().toLocaleDateString()}`;
      doc.text(footerText, pageWidth - 20, pageHeight - 10, { align: "right" });
      doc.text(dateText, 14, pageHeight - 10);
    }

    // Save the PDF
    const pdfName = `Sales_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(pdfName);
  };

  const getReportPeriod = () => {
    if (reportType === "yearly") {
      return `Year: ${year}`;
    }
    if (reportType === "quarterly") {
      return `Quarter: ${quarter}, Year: ${year}`;
    }
    if (reportType === "half-yearly") {
      return `Half-Year: ${halfYear === 1 ? "Jan - Jun" : "Jul - Dec"}, Year: ${year}`;
    }
    if (reportType === "custom") {
      return `Custom Period: ${customStartDate} to ${customEndDate}`;
    }
  };

  const handleCustomerTypeChange = (e) => {
    setTypeOfCustomer(e.target.value);  // Update the state when selection changes
  };

  useEffect(() => {
    fetchDropdowns();
  }, [filterType]);

  return (
    <div className="sales-report">
      <h1>Generate Sales Report</h1>
      <div className="form-group">
        <label htmlFor="filterType">Select Filter Type</label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="date">By Date</option>
          <option value="typeOfCustomer">By Type of Customer</option>
        </select>
      </div>
      {filterType === "date" && (
        <div>
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
              <label htmlFor="yearQuarter">Select Year</label>
              <select
                id="yearQuarter"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
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
              <label htmlFor="yearHalf">Select Year</label>
              <select
                id="yearHalf"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <label htmlFor="halfYear">Select Half-Year</label>
              <select
                id="halfYear"
                value={halfYear}
                onChange={(e) => setHalfYear(e.target.value)}
              >
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
        </div>
      )}

      {filterType === 'typeOfCustomer' && (
        <div className="form-group">
          <label htmlFor="typeOfCustomer">Select Customer Type</label>
          <select
            id="typeOfCustomer"
            value={typeOfCustomer}  // Binding the value to state
            onChange={handleCustomerTypeChange}  // Update state on change
          >
            {typeOfCustomerOptions.map((option) => (
              <option key={option._id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleGenerateReport}>Generate Report</button>
      {reportData && (
        <div className="report-display">
          <h4>Executive Summary</h4>
          <p>Report Period: {getReportPeriod()}</p>
          <p>Total RFQs: {calculateMetrics(reportData).totalRFQs}</p>
          <p>Total Quoted Value: Rs{calculateMetrics(reportData).totalQuotedValue}</p>
          <p>Converted RFQs: {calculateMetrics(reportData).totalConvertedRFQs}</p>
          <p>Lost RFQs: {calculateMetrics(reportData).totalLostRFQs}</p>
          <h4>Key Metrics Overview</h4>
          <p>Total Customers Engaged: {calculateMetrics(reportData).totalCustomersEngaged}</p>
          <p>Total Projects: {calculateMetrics(reportData).totalProjects}</p>
          <p>Average Quoted Value: Rs{calculateMetrics(reportData).averageQuotedValue}</p>
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
                  <td>Rs{entry.quotedValue}</td>
                  <td>{entry.statusOfRFQ}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="report-options">
        <button onClick={downloadCSV} disabled={!reportData}>
          Download CSV
        </button>
        <button onClick={downloadPDF} disabled={!reportData}>
          Download PDF
        </button>
      </div>

      <ToastContainer />
    </div>
  );

};
export default SalesReport;