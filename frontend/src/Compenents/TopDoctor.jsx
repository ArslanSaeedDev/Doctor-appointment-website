import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext'; // Import AppContext

function TopDoctor() {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext); // Use AppContext

  return (
    <div className="flex flex-col my-5 px-4">
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center my-4 text-center">
        <h1 className="text-2xl md:text-4xl font-medium leading-10 text-gray-800">Top Doctors to Book</h1>
        <p className="text-sm md:text-lg font-normal leading-6 md:leading-7 text-gray-600 font-sans">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* Doctor Cards Section */}
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4 mt-5 md:grid-cols-[repeat(auto-fit,_minmax(190px,_1fr))]">
        {doctors.slice(0, 12).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
           
            className="flex flex-col border border-gray-200 rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
          >
            {/* Doctor Image */}
            <div className="w-full bg-blue-50 h-[250px] md:h-[180px]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>

            {/* Availability Section */}
            <div className="flex items-center px-2 py-1">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <p className="ml-2 text-green-500 font-sans text-sm font-normal">Available</p>
            </div>

            {/* Doctor Information */}
            <div className="px-2 pb-4">
              <p className="text-sm md:text-base font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs md:text-sm font-normal text-gray-600 leading-[1.125rem]">
                {item.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className='text-center my-8'>
        <button onClick={() => navigate(`/doctor`)} className="px-12 py-3 text-gray-600 bg-blue-50 hover:bg-blue-100 rounded-full">
          more
        </button>
      </div>


    </div>
  );
}

export default TopDoctor;
