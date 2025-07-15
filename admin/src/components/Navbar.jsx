import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext.jsx';



function Navbar() {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setdToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const logOut = () => {
    setAToken('');
    setdToken('');
    localStorage.removeItem('aToken');
    localStorage.removeItem('dToken');
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between px-4 sm:px-8 py-4 border-b bg-white '>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40  cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full'>{aToken ? "admin" : "doctor"}</p>
      </div>
      <button onClick={logOut} className='bg-primary text-sm py-2 px-6 md:px-10 rounded-full text-white cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar
