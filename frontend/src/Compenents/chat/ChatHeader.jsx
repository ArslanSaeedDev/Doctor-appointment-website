import React from 'react';

function ChatHeader({ name, image, speciality, isOnline, onBack }) {
  return (
    <div className="flex items-center gap-3 p-3 border-b bg-white">
      {onBack && (
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 sm:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <div className="relative">
        <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div>
        <p className="font-medium text-gray-800 text-sm">{name}</p>
        <p className="text-xs text-gray-500">
          {speciality && <span>{speciality} &middot; </span>}
          {isOnline ? <span className="text-green-500">Online</span> : <span>Offline</span>}
        </p>
      </div>
    </div>
  );
}

export default ChatHeader;
