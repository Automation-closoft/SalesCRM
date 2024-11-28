import React from 'react'
import Login from '../src/Pages/Login/Login'
import { Route, Routes } from 'react-router-dom'
import Add from './Pages/Add/Add'
import ListView from './Pages/ListView/ListView'
import DetailedView from './Pages/DetailedView/DetailedView'
import Dashboard from './Components/DashBoard/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <ToastContainer />
      <div className='app'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/detail" element={<DetailedView />} />
        </Routes>
      </div>
    </>
  )
}

export default App