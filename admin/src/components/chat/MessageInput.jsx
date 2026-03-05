import React, { useState, useRef, useCallback } from 'react';

function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
    }, 2000);
  };

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onStopTyping?.();
  }, [text, onSend, onStopTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        maxLength={2000}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
