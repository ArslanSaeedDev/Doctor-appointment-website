import React from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';


function SideBar() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return (
    <div className='min-h-screen border-r bg-white'>
      {
        aToken && <ul className='text-[#515151] mt-5 '>
          <NavLink to={"/admin-dashboard"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.home_icon} alt="" />
            <p>DashBoard</p>
          </NavLink>
          <NavLink to={"/all-appointment"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} >
            <img src={assets.appointment_icon} alt="" />
            <p> Appointments</p>
          </NavLink>
          <NavLink to={"/doctor-list"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.people_icon} alt="" />
            <p>Doctor List</p>
          </NavLink>
          <NavLink to={"/add-doctor"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.add_icon} alt="" />
            <p>Add Doctor</p>
          </NavLink>
        </ul>

      }
      {
        dToken && <ul className='text-[#515151] mt-5 '>
          <NavLink to={"/doctor-dashboard"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>DashBoard</p>
          </NavLink>
          <NavLink to={"/doctor-appointments"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} >
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'> Appointments</p>
          </NavLink>
          <NavLink to={"/profile"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      }

    </div>
  )
}

export default SideBar
