import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function NotificationPopup({ notifications, onDismiss }) {
  const navigate = useNavigate();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notif) => (
        <NotificationCard
          key={notif.id}
          notification={notif}
          onDismiss={() => onDismiss(notif.id)}
          onNavigate={() => {
            navigate(`/chat`);
            onDismiss(notif.id);
          }}
        />
      ))}
    </div>
  );
}

function NotificationCard({ notification, onDismiss, onNavigate }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      onClick={onNavigate}
      className={`bg-white rounded-xl shadow-2xl border border-gray-100 p-3 cursor-pointer hover:bg-gray-50 transition-all duration-300 flex items-center gap-3 ${
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0 animate-slide-in'
      }`}
      style={{
        animation: isExiting ? 'none' : 'slideInRight 0.3s ease-out',
      }}
    >
      {/* Sender Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={notification.senderImage}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
      </div>

      {/* Message Preview */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-800 truncate">{notification.senderName}</p>
        <p className="text-xs text-gray-500 truncate">{notification.text}</p>
        <p className="text-[10px] text-blue-500 mt-0.5">Tap to reply</p>
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="text-gray-300 hover:text-gray-500 flex-shrink-0 p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

export default NotificationPopup;
