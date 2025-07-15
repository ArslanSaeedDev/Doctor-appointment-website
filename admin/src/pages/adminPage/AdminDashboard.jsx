import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from "../../assets/assets";

function AdminDashboard() {
  const { aToken, dashData, adminDashboard, cancelAppointment } = useContext(AdminContext);

  useEffect(() => {
    if(aToken){
      adminDashboard();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* Top Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Doctors */}
          <div className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4 hover:scale-105 transition-transform">
            <img src={assets.doctor_icon} alt="Doctor Icon" className="w-12 h-12" />
            <div>
              <p className="text-xl font-semibold">{dashData.doctors}</p>
              <p className="text-gray-500">Doctors</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4 hover:scale-105 transition-transform">
            <img src={assets.appointments_icon} alt="Appointments Icon" className="w-12 h-12" />
            <div>
              <p className="text-xl font-semibold">{dashData.appointment}</p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4 hover:scale-105 transition-transform">
            <img src={assets.patients_icon} alt="Patients Icon" className="w-12 h-12" />
            <div>
              <p className="text-xl font-semibold">{dashData.users}</p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-y-scroll max-h-[60vh]">
          <div className="flex items-center gap-2 mb-4 ">
            <img src={assets.list_icon} alt="List Icon" className="w-6 h-6" />
            <p className="text-lg font-semibold">Latest Bookings</p>
          </div>

          {dashData.latestAppointment.length === 0 ? (
            <p className="text-gray-400">No latest bookings</p>
          ) : (
            dashData.latestAppointment.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-md mb-2 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <img src={item.docData.image} alt="Doctor" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium">{item.docData.name}</p>
                    <p className="text-sm text-gray-400">{item.slotDate}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">{item.slotTime}</div>

                <div className="cursor-pointer">
                  {item.cancelled ? (
                    <p className="text-red-500 font-medium text-sm">Cancelled</p>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      src={assets.cancel_icon}
                      alt="Cancel"
                      className="w-12 "
                    />
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

export default AdminDashboard;
