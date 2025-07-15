import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/adminPage/AdminDashboard';
import AddDoctor from './pages/adminPage/AddDoctor';
import AllAppointment from './pages/adminPage/AllAppointment';
import DoctorList from './pages/adminPage/DoctorList';
import DoctorDashboard from './pages/doctorPage/DoctorDashboard';
import DoctorAppointments from './pages/doctorPage/DoctorAppointments';
import Profile from './pages/doctorPage/Profile';

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // Authenticated
  if (aToken || dToken) {
    return (
      <div className='bg-[#F8F9FD]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <SideBar />
          <div className='flex-1 p-4'>
            <Routes>
              {/* Admin Routes */}
              <Route path='/' element={<AdminDashboard />} />
              <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/all-appointment' element={<AllAppointment />} />
              <Route path='/doctor-list' element={<DoctorList />} />

              {/* Doctor Routes */}
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/doctor-appointments' element={<DoctorAppointments />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
}

export default App;
