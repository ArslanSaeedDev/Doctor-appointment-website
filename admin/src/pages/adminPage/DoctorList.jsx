import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorList = () => {
  const { backendUrl, getAllDoctor, doctorData, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    getAllDoctor();
  }, [backendUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Doctor List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctorData.map((item, index) => (
          <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" key={index}>
            <div className="relative bg-gray-100 group-hover:bg-blue-50 transition-colors duration-300">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover object-center"
              />
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mt-1">{item.speciality}</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  onChange={() => changeAvailability(item._id)}
                  checked={item.available}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {item.available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;