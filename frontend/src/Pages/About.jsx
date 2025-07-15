import React from 'react'
import { assets } from '../assets/assets'

function About() {
  return (
    <div className="container  py-10">
    {/* About Us Section */}
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-500 uppercase">About <span className="text-primary">Us</span></h2>
    </div>
    <div className="flex flex-col md:flex-row gap-12 mt-12 ">
      <img src={assets.about_image} alt="Doctors" className="w-full md:w-96   " />
      <div className=' mr-12 md:mr-40'>
        <p className="text-gray-700 leading-relaxed mb-8">
          Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
        </p>
        <h3 className="text-xl font-bold my-8 text-gray-700">Our Vision</h3>
        <p className="text-gray-700 leading-relaxed">
          Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
        </p>
      </div>
    </div>
    
    {/* Why Choose Us Section */}
    <div className="text-center mt-16">
      <h2 className="text-3xl font-bold uppercase">Why <span className="text-primary">Choose Us</span></h2>
    </div>
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      <div className="border p-6 rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Efficiency:</h3>
        <p className="text-gray-700 mt-2">Streamlined appointment scheduling that fits into your busy lifestyle.</p>
      </div>
      <div className="border p-6 rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Convenience:</h3>
        <p className="text-gray-700 mt-2">Access to a network of trusted healthcare professionals in your area.</p>
      </div>
      <div className="border p-6 rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Personalization:</h3>
        <p className="text-gray-700 mt-2">Tailored recommendations and reminders to help you stay on top of your health.</p>
      </div>
    </div>
  </div>

  )
}

export default About
