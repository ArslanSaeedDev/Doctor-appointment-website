import React, { useContext, useState } from 'react';
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AppContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logOut = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className='flex justify-between items-center py-4 mb-5 border-b border-b-gray-400 px-4 relative'>
      <img className="w-44 cursor-pointer" src={assets.logo} alt="logo" />

      {/* Desktop Menu */}
      <ul className='hidden sm:flex items-center gap-5 font-medium '>
        <NavLink to='/'>
          <li className='py-1'>Home</li>
          <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to="/doctor">
          <li className='py-1'>All Doctors</li>
          <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto  hidden' />
        </NavLink>
        <NavLink to="/about">
          <li className='py-1'>About</li>
          <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto  hidden' />
        </NavLink>
        <NavLink to="/contact">
          <li className='py-1'>Contact</li>
          <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto  hidden ' />
        </NavLink>
      </ul>


      {/* Mobile Toggle Button */}
      <div className="sm:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <ul className='absolute top-16 left-0 w-full bg-white z-50 flex flex-col items-start gap-4 px-6 py-4 sm:hidden shadow-lg font-medium'>
          <NavLink to='/' onClick={() => setIsMobileMenuOpen(false)}><li>Home</li> <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto hidden' /></NavLink>
          <NavLink to='/doctor' onClick={() => setIsMobileMenuOpen(false)}><li>All Doctors</li> <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto hidden' /></NavLink>
          <NavLink to='/about' onClick={() => setIsMobileMenuOpen(false)}><li>About</li> <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto hidden' /></NavLink>
          <NavLink to='/contact' onClick={() => setIsMobileMenuOpen(false)}><li>Contact</li> <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto hidden' /></NavLink>

          {token ? (
            <div className="w-full flex flex-col gap-2 border-t pt-3 cursor-pointer">
              <p onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}>My Profile</p>
              <p onClick={() => { navigate("/myAppointment"); setIsMobileMenuOpen(false); }}>My Appointment</p>
              <p onClick={() => { logOut(); setIsMobileMenuOpen(false); }}>Logout</p>
            </div>
          ) : (
            <button
              onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
              className="text-white bg-primary rounded-full font-normal py-2 px-6"
            >
              Create Account
            </button>
          )}
        </ul>
      )}

      {/* Desktop Auth Options */}
      <div className="hidden sm:flex items-center gap-4">
        {token ? (
          <div className="flex gap-2 items-center cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image || assets.upload_icon} alt="Profile" />
            <img className="w-3.5 h-2" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-full pt-6 right-0 z-20 text-gray-600 text-base font-normal hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 flex flex-col gap-2 py-3 rounded">
                <p onClick={() => navigate("/profile")} className="hover:text-black px-4 cursor-pointer">My Profile</p>
                <p onClick={() => navigate("/myAppointment")} className="hover:text-black px-4 cursor-pointer">My Appointment</p>
                <p onClick={logOut} className="hover:text-black px-4 cursor-pointer">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="text-white bg-primary rounded-full font-normal py-3 px-8">
            Create Account
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
