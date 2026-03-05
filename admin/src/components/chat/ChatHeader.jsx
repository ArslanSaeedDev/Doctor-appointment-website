import React from 'react';

function ChatHeader({ name, image, subtitle, isOnline }) {
  return (
    <div className="flex items-center gap-3 p-3 border-b bg-white">
      <div className="relative">
        <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div>
        <p className="font-medium text-gray-800 text-sm">{name}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        <p className="text-xs">
          {isOnline ? <span className="text-green-500">Online</span> : <span className="text-gray-400">Offline</span>}
        </p>
      </div>
    </div>
  );
}

export default ChatHeader;
