import React from 'react';

function ConversationItem({ conversation, isActive, isOnline, onClick }) {
  const doc = conversation.docId;
  const unread = conversation.userUnread || 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-primary' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        <img src={doc?.image} alt={doc?.name} className="w-10 h-10 rounded-full object-cover" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm text-gray-800 truncate">{doc?.name}</p>
          {unread > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{conversation.lastMessage || 'Start chatting...'}</p>
      </div>
    </div>
  );
}

export default ConversationItem;
