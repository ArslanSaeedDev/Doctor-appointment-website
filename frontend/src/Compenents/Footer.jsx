import React from 'react';
import { assets } from '../assets/assets';


function Footer() {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr,1fr,1fr] gap-8 sm:gap-14 mt-40 text-sm md:text-base text-gray-600 ' >
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt='' />
          <p className=' w-full  leading-6'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>
        {/* center */}
        <div>
          <p className='text-xl font-semibold mb-5 '>COMPANY</p>
          <ul className='flex flex-col gap-2 '>
            <li>Home </li>
            <li>About</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/* left */}
        <div>
            <p className='text-xl font-semibold mb-5'>Get in Touch </p>
            <ul className='flex flex-col gap-2' >
                <li>121-212-2121</li>
                <li>guroarslan@gmail.com</li>
            </ul>
        </div>
      </div>
      <div className='mt-8'>
        <hr />
        <p className='text-center text-gray-600 my-5'>Copyright © 2024 GreatStack - All Right Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
