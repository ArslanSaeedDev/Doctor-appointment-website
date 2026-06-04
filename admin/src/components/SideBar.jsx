import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { ChatContext } from '../context/ChatContext';


function SideBar() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { unreadCount } = useContext(ChatContext);
  return (
    <div className='min-h-screen border-r bg-white'>
      {
        aToken && <ul className='text-[#515151] mt-5 '>
          <NavLink to={"/admin-dashboard"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>DashBoard</p>
          </NavLink>
          <NavLink to={"/all-appointment"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} >
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block' > Appointments</p>
          </NavLink>
          <NavLink to={"/doctor-list"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctor List</p>
          </NavLink>
          <NavLink to={"/add-doctor"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink to={"/messages"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Messages</p>
          </NavLink>
        </ul>

      }
      {
        dToken && <ul className='text-[#515151] mt-5 '>
          <NavLink to={"/doctor-dashboard"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.home_icon} alt="" />
            <p  className='hidden md:block'>DashBoard</p>
          </NavLink>
          <NavLink to={"/doctor-appointments"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} >
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'> Appointments</p>
          </NavLink>
          <NavLink to={"/profile"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <img src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
          <NavLink to={"/doctor-messages"} className={({ isActive }) => `flex items-center  gap-3 px-3 md:px-9 py-3.5  md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
            <div className="relative">
              <img src={assets.people_icon} alt="" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <p className='hidden md:block'>Messages</p>
          </NavLink>
        </ul>
      }

    </div>
  )
}

export default SideBar
