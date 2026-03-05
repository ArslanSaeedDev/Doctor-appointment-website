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
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        <p className="break-words">{message.text}</p>
        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
            {time}
          </span>
          {isMine && (
            <span className={`text-[10px] ${message.read ? 'text-blue-200' : 'text-blue-100'}`}>
              {message.read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
