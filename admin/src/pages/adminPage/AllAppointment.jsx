import React from 'react'
import { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from "../../assets/assets.js"


function AllAppointment() {
  const { appointments, getAppointments, calculateAge , cancelAppointment} = useContext(AdminContext);




  useEffect(() => {
    getAppointments()

  }, [])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointment</p>

      <div className='bg-white border rounded text-sm max-h[80vh] min-h-[60vh] overflow-y-scroll'>

        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-2 bg-gray-100 border-b font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {
          appointments.map((item, index) => (
            <div key={index} className='flex flex-wrap sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-2 border-b justify-between items-center text-gray-500 hover:bg-gray-50'>
              <p className="max-sm-hidden">{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image} alt="" />
                <p>{item.userData.name} </p>
              </div>
              <p className='max-sm-hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{(item.slotDate)}, {item.slotTime}</p>     
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.docData.image} alt="" />
                <p>{item.docData.name} </p>
              </div>
              <p>${item.docData.fees}</p>
              <div className=' cursor-pointer'>
                {
                  item.cancelled ?
                  <p className='text-red-400 font-medium text-xs '>Cancelled</p> 
                  : <img onClick={() => cancelAppointment(item._id)} className='w-8 rounded-full' src={assets.cancel_icon} alt="" />


                }
               
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default AllAppointment
