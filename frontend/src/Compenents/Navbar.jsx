import React, { useContext, useState } from 'react';
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ChatContext } from '../context/ChatContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import NotificationPopup from './chat/NotificationPopup';

function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AppContext);
  const { unreadCount, notifications, dismissNotification } = useContext(ChatContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logOut = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <>
      <div className='flex justify-between items-center py-4 mb-5 border-b border-b-gray-400 px-4 relative'>
        <img className="w-44 cursor-pointer" src={assets.logo} alt="logo" onClick={() => navigate('/')} />

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

          {/* Messages Nav Item with badge (Facebook/WhatsApp style) */}
          {token && (
            <NavLink to="/chat" className="relative">
              <li className='py-1 flex items-center gap-1'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Messages
              </li>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              <hr className='border-none h-0.5 outline-none bg-primary w-3/5 m-auto hidden' />
            </NavLink>
          )}
        </ul>

        {/* Mobile Toggle + Message Icon */}
        <div className="sm:hidden flex items-center gap-3">
          {token && (
            <button onClick={() => navigate('/chat')} className="relative p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 animate-pulse-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
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
                <p onClick={() => { navigate("/chat"); setIsMobileMenuOpen(false); }} className="flex items-center gap-2">
                  Messages
                  {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </p>
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
                <div className="min-w-48 bg-stone-100 flex flex-col gap-2 py-3 rounded shadow-lg">
                  <p onClick={() => navigate("/profile")} className="hover:text-black px-4 cursor-pointer">My Profile</p>
                  <p onClick={() => navigate("/myAppointment")} className="hover:text-black px-4 cursor-pointer">My Appointment</p>
                  <p onClick={() => navigate("/chat")} className="hover:text-black px-4 cursor-pointer flex items-center gap-2">
                    Messages
                    {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                  </p>
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

      {/* Floating Notification Popups (WhatsApp/Facebook style) */}
      {token && (
        <NotificationPopup
          notifications={notifications}
          onDismiss={dismissNotification}
        />
      )}
    </>
  );
}

export default Navbar;
