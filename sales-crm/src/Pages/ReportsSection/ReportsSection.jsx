import React, { useState } from "react";
import SalesReport from "../../Components/SalesReport/SalesReport";

const ReportsSection = () => {
  const [reports, setReports] = useState([]);

  const handleReportGenerated = (reportData) => {
    setReports((prevReports) => [...prevReports, reportData]);
  };

  return (
    <div>
      <h2>Sales CRM Reports</h2>
      <SalesReport onReportGenerated={handleReportGenerated} />
      
      {reports.length > 0 && (
        <div>
          <h3>Generated Reports:</h3>
          <ul>
            {reports.map((report, index) => (
              <li key={index}>
                <span>{`${report.reportType} Report - ${new Date(report.date).toLocaleString()}`}</span>
                <a href={`/${report.pdfName}`} download>
                  Download PDF
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;
