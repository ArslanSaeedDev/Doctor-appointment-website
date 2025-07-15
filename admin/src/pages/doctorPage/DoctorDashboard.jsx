import React, { useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from "../../assets/assets";

function DoctorDashboard() {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="px-4 py-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto w-full">

        {/* Top Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Appointments */}
          <div className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4 hover:scale-105 transition-transform">
            <img src={assets.appointments_icon} alt="Appointments Icon" className="w-12 h-12" />
            <div>
              <p className="text-xl font-semibold">{dashData.totalAppointments}</p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4 hover:scale-105 transition-transform">
            <img src={assets.patients_icon} alt="Patients Icon" className="w-12 h-12" />
            <div>
              <p className="text-xl font-semibold">{dashData.totalPatients}</p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[60vh]">
          <div className="flex items-center gap-2 mb-4">
            <img src={assets.list_icon} alt="List Icon" className="w-6 h-6" />
            <p className="text-lg font-semibold">Latest Bookings</p>
          </div>

          {dashData.latestAppointment.length === 0 ? (
            <p className="text-gray-400">No latest bookings</p>
          ) : (
            dashData.latestAppointment.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-md mb-2 hover:bg-gray-50 gap-2"
              >
                <div className="flex items-center gap-2">
                  <img src={item.docData.image} alt="Doctor" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium">{item.docData.name}</p>
                    <p className="text-sm text-gray-400">{item.slotDate}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">{item.slotTime}</div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {item.isCompleted ? (
                    <p className="text-xs text-blue-500 px-2 py-1">Completed</p>
                  ) : item.cancelled ? (
                    <p className="text-xs text-red-400 px-2 py-1">Cancelled</p>
                  ) : (
                    <>
                      <img
                        onClick={() => cancelAppointment(item._id, dToken)}
                        src={assets.cancel_icon}
                        alt="Cancel"
                        className="w-8 cursor-pointer hover:scale-110 transition"
                      />
                      <img
                        onClick={() => completeAppointment(item._id, dToken)}
                        src={assets.tick_icon}
                        alt="Confirm"
                        className="w-8 cursor-pointer hover:scale-110 transition"
                      />
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  );
}

export default DoctorDashboard;
