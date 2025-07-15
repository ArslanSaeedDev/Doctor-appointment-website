import React from 'react';
import { assets } from '../assets/assets';


function Banner() {
  return (
    <div className="bg-primary rounded-lg mx-2 md:mx-4 ">
      <div className="relative  px-6 sm:px-10 lg:px-12 my-20  ">
        <div className="flex flex-col md:flex-row relative ">
          {/* Left Content */}
          <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24">
            <div className="text-xl sm:text-2xl md:text-xl lg:text-4xl xl:text-5xl font-semibold text-white">
              <p>Book Appointment</p>
              <p className="mt-2 sm:mt-4 md:mt-4  lg:mt-6">With 100+ Trusted Doctors</p>
            </div>
            <button className="bg-white text-sm sm:text-base text-gray-600 px-6 py-2 sm:px-8 sm:py-3 rounded-full mt-4 md:mt-6 hover:bg-gray-100 transition-colors">
              Create Account
            </button>
          </div>

          {/* Right Image Container */}
          <div className="hidden md:block w-full md:w-1/2 lg:w-[45%] relative">
            <div className="absolute bottom-0 right-0 h-[110%] w-full z-10" >
              <img
                className="w-full h-full object-contain object-bottom"
                src={assets.appointment_img}
                alt="Medical team illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Banner;