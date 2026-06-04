import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotificationPopup({ notifications, onDismiss, navigateTo }) {
  const navigate = useNavigate();

  if (notifications.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px' }}>
      {notifications.map((notif) => (
        <NotificationCard
          key={notif.id}
          notification={notif}
          onDismiss={() => onDismiss(notif.id)}
          onNavigate={() => {
            navigate(navigateTo || '/doctor-messages');
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

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      onClick={onNavigate}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
        padding: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.3s ease',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateX(120%)' : 'translateX(0)',
        animation: isExiting ? 'none' : 'slideIn 0.3s ease-out',
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={notification.senderImage}
          alt=""
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute', top: '-2px', right: '-2px', width: '14px', height: '14px',
          backgroundColor: '#22c55e', border: '2px solid white', borderRadius: '50%'
        }}></span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '14px', color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {notification.senderName}
        </p>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {notification.text}
        </p>
        <p style={{ fontSize: '10px', color: '#3b82f6', margin: '3px 0 0' }}>Tap to reply</p>
      </div>

      <button
        onClick={handleDismiss}
        style={{ color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0, fontSize: '16px' }}
      >
        x
      </button>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default NotificationPopup;
