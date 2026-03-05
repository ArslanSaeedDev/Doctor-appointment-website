import React from 'react';

function MessageBubble({ message, isMine }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
          isMine
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        <p style={{ wordBreak: 'break-word' }}>{message.text}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
            {time}
          </span>
          {isMine && (
            <span className={`text-[10px] ${message.read ? 'text-blue-200' : 'text-blue-300'}`}>
              {message.read ? '  ' : ' '}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
