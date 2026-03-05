import React from 'react';
import ConversationItem from './ConversationItem';

function ConversationList({ conversations, activeId, onlineDoctors, onSelect }) {
  return (
    <div className="flex flex-col h-full border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isActive={activeId === conv._id}
              isOnline={onlineDoctors.includes(conv.docId?._id)}
              onClick={() => onSelect(conv)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationList;
