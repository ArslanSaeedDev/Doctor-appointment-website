import React from 'react'
import { assets } from '../assets/assets'

function Contact() {
  return (
    <section className=" py-12 px-6 md:px-20">
      <div className='text-center mb-12'>

     
      <h2 className="text-3xl font-bold text-gray-500 uppercase">Contact <span className="font-bold text-primary">Us</span></h2>
      </div>
    {/* Image Section */}
    <div className='flex flex-col md:flex-row items-center justify-center'>

    
    <div className=" w-72 md:w-96">
      <img
        src={assets.contact_image}
        alt="Doctor with patient"
       
      />
    </div>
    
    {/* Contact Info Section */}
    <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-12 text-gray-500">
      
      
      <div className="">
        <h3 className="text-2xl font-semibold  uppercase">Our Office</h3>
        <p className="text-gray-600 mt-2">54709 Willims Station<br/>Suite 350, Washington, USA</p>
        <p className="text-gray-600 mt-2">Tel: (415) 555-0132</p>
        <p className="text-gray-600">Email: greatstackdev@gmail.com</p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-semibold text-2xl uppercase">Careers at Prescripto</h3>
        <p className="text-gray-600 mt-2">Learn more about our teams and job openings.</p>
        <button className="mt-4 px-5 py-2 border border-gray-700  text-gray-700 hover:bg-gray-700 hover:text-white transition duration-300">
          Explore Jobs
        </button>
      </div>
    </div>
    </div>
  </section>
  )
}

export default Contact
