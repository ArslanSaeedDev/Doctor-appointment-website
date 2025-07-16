import React from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
  return (
    <div className='flex flex-col md:flex-row bg-primary rounded-lg px-4 sm:px-6 md:px-8 lg:px-16 relative overflow-hidden'>
      {/* --- Left Side --- */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-8 sm:py-12 md:py-16 lg:py-24'>
        <h1 className='text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-white font-semibold md:leading-tight lg:leading-tight'>
          Book Appointment
          <br />
          <span className='mt-1 sm:mt-2 md:mt-3 block'>
            With Trusted Doctors
          </span>
        </h1>

        <div className='flex flex-col md:flex-row justify-start gap-3 text-white text-sm sm:text-base font-light'>
          <img
            className='w-16 sm:w-20 md:w-24 lg:w-28 self-start'
            src={assets.group_profiles}
            alt='Trusted Doctors'
          />
          <p className='flex flex-col text-white text-sm lg:text-base font-light'>
            Simply browse through our extensive list of trusted doctors,
            <br className='hidden xl:block' />
            or search for specific specialists in your area.
          </p>
        </div>

        <a
          href='/doctor'
          className='flex items-center gap-2 bg-white px-6 py-2 sm:px-8 sm:py-3 font-medium rounded-full text-gray-700 text-sm sm:text-base mt-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg'
        >
          Book Appointment
          <img className='w-3' src={assets.arrow_icon} alt='Arrow icon' />
        </a>
      </div>

      {/* --- Right Side --- */}
      <div className='md:w-1/2 flex items-end justify-end'>
        <img
          className='hidden md:block w-full max-w-xl lg:max-w-none lg:h-auto object-contain object-bottom'
          src={assets.header_img}
          alt='Medical Team'
        />
      </div>
    </div>
  );
};

export default Hero;