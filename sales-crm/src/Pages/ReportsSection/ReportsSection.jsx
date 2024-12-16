import React, { useState } from "react";
import SalesReport from "../../Components/SalesReport/SalesReport";

const ReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleReportGenerated = (reportData) => {
    setReports((prevReports) => [...prevReports, reportData]);
    setGeneratedReport(reportData.report);
    setIsReportVisible(true); // Show the report before download
  };

  const handleDownload = () => {
    const pdfLink = generatedReport.pdfName; // assuming pdfName is part of the report
    const link = document.createElement("a");
    link.href = `/${pdfLink}`;
    link.download = pdfLink;
    link.click(); // Triggers the download
  };

  return (
    <div>
      <h2>Sales CRM Reports</h2>
      <SalesReport onReportGenerated={handleReportGenerated} />

      {isReportVisible && generatedReport && (
        <div>
          <h3>Generated Report:</h3>
          <div>
            {/* Executive Summary */}
            <h4>Executive Summary</h4>
            <p>Report Period: {generatedReport.reportPeriod}</p>
            <p>Total RFQs: {generatedReport.totalRFQs}</p>
            <p>Total Quoted Value: ₹{generatedReport.totalQuotedValue}</p>
            <p>Converted RFQs: {generatedReport.totalConvertedRFQs}</p>
            <p>Lost RFQs: {generatedReport.totalLostRFQs}</p>

            {/* Key Metrics Overview */}
            <h4>Key Metrics Overview</h4>
            <p>Total Customers Engaged: {generatedReport.totalCustomersEngaged}</p>
            <p>Total Projects: {generatedReport.totalProjects}</p>
            <p>Average Quoted Value: ₹{generatedReport.averageQuotedValue}</p>

            {/* RFQ Details */}
            <h4>RFQ Details</h4>
            <ul>
              {generatedReport.rfqDetails.map((entry, index) => (
                <li key={index}>
                  {entry.customerName} - {entry.projectName} - {entry.statusOfRFQ}
                </li>
              ))}
            </ul>

            {/* Button to trigger PDF download */}
            <button onClick={handleDownload}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;
