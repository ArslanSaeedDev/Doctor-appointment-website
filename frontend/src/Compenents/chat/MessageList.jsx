import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

function MessageList({ messages, currentUserId, isTyping, onLoadMore, hasMore }) {
  const endRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Infinite scroll up for pagination
  const handleScroll = () => {
    if (containerRef.current?.scrollTop === 0 && hasMore) {
      onLoadMore?.();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50"
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
        </div>
      )}
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg._id || index}
          message={msg}
          isMine={msg.senderId === currentUserId}
        />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}

export default MessageList;
