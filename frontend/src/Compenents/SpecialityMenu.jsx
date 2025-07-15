import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

function SpecialityMenu() {
  return (
    <div id='Speciality' className='flex flex-col items-center gap-4 py-16 '>
      <h1 className='text-3xl font-medium text-gray-800'>Find by Speciality</h1>
      <p className='w-full text-gray-600 sm:w-1/2 lg:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment
        hassle-free.
      </p>

      <div className='flex justify-start sm:justify-center pt-5 gap-4 lg:gap-8 w-full overflow-x-auto scroll-smooth whitespace-nowrap scrollbar-hide'>
        {specialityData.map((item, index) => (
          <Link
            onClick={() => {
              scrollTo(0, 0);
            }}
            className='flex flex-col items-center text-xs cursor-pointer  w-20 sm:w-24 md:w-28 lg:w-32'
            key={index}
            to={`/doctor/${item.speciality}`}>
            <img
              className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-full mb-2'
              src={item.image}
              alt={item.speciality}
            />
            <p className='text-center text-gray-700'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SpecialityMenu;
