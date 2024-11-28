import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';
import Add from '../../Pages/Add/Add';
import ListView from '../../Pages/ListView/ListView';
import './Dashboard.css';

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
        </div>
      </div>
      <div className='content'>
        {selectedSection === 'add' && <Add />}
        {selectedSection === 'list' && <ListView />}
        {selectedSection === 'reports' && <p>Reports Section</p>}
      </div>
    </div>
  );
};

export default Dashboard;
