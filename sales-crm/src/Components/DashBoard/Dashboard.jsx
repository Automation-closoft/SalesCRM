import React, { useState } from 'react';
import { assets } from '../../assets/assets';
// import { NavLink } from 'react-router-dom';
import Add from '../../Pages/Add/Add';
import ListView from '../../Pages/ListView/ListView';
// import DetailedView from '../../Pages/DetailedView/DetailedView';
import './DashBoard.css';
import ReportsSection from '../../Pages/ReportsSection/ReportsSection';
import Admin from '../../Pages/AdminPage/Admin';
const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('add'); // Default to Add
  return (
    <div className='dashboard'>
      <div className='sidebar'>
        <div className="sidebar-options">
          <button onClick={() => setSelectedSection('add')} className="sidebar-option">
            <img src={assets.add} alt="" />
            <p>Add/Update</p>
          </button>
          <button onClick={() => setSelectedSection('list')} className="sidebar-option">
            <img src={assets.list} alt="" />
            <p>List View</p>
          </button>
          <button onClick={() => setSelectedSection('reports')} className="sidebar-option">
            <img src={assets.list} alt="" />
            <p>Reports</p>
          </button>
          <button onClick={() => setSelectedSection('admin')} className="sidebar-option">
            <img src={assets.list} alt="" />
            <p>Admin</p>
          </button>
        </div>
      </div>
      <div className='content'>
        {selectedSection === 'add' && <Add />}
        {selectedSection === 'list' && <ListView />}
        {selectedSection === 'reports' && <ReportsSection/>}
        {selectedSection === 'admin' && <Admin/>}
      </div>
    </div>
  );
};
export default Dashboard;