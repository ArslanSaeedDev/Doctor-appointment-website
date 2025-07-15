import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

function DoctorAppointments() {
  const { appointments, getAppointments, dToken, cancelAppointment, completeAppointment } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, []);

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-6'>
      <h2 className='mb-4 text-xl font-semibold text-gray-800'>All Appointments</h2>

      <div className='bg-white border border-gray-200 rounded shadow-md text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] bg-gray-100 border-b px-4 py-2 font-semibold text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Table Body */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] items-center px-4 py-3 border-b text-gray-800 gap-2'
          >
            <p>{index + 1}</p>

            {/* Patient Info */}
            <div className='flex items-center gap-2'>
              <img
                src={item.userData.image}
                alt='patient'
                className='w-10 h-10 rounded-full object-cover border'
              />
              <p>{item.userData.name}</p>
            </div>

            {/* Payment Type */}
            <p className='text-xs inline border border-primary px-2 py-1 rounded-full w-12'>Cash</p>

            {/* Age (from dob or show dob directly) */}
            <p>{item.userData.dob}</p>

            {/* Date & Time */}
            <div className='flex flex-col'>
              <span>{item.slotDate}</span>
              <span className='text-xs text-gray-500'>{item.slotTime}</span>
            </div>

            {/* Fees */}
            <p>${item.amount}</p>

            {/* Action Buttons */}
            <div className='flex items-center gap-2'>
              {
                item.isCompleted ? (
                  <p className='text-xs inline text-blue-500 px-2 py-1'>Completed</p>
                ) : item.cancelled ? (
                  <p className='text-xs inline text-red-400 px-2 py-1'>Cancelled</p>
                ) : (
                  <>
                    <img
                      onClick={() => cancelAppointment(item._id, dToken)}
                      src={assets.cancel_icon}
                      alt='Cancel'
                      className='w-8 cursor-pointer hover:scale-110 transition'
                    />
                    <img
                      onClick={() => completeAppointment(item._id, dToken)}
                      src={assets.tick_icon}
                      alt='Confirm'
                      className='w-8 cursor-pointer hover:scale-110 transition'
                    />
                  </>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAppointments;
