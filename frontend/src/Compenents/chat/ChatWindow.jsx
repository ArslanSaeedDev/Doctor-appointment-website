import React, { useContext, useEffect, useState, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatContext } from '../../context/ChatContext';
import { AppContext } from '../../context/AppContext';

function ChatWindow({ conversation, onBack }) {
  const { messages, setMessages, sendMessage, emitTyping, emitStopTyping, markAsRead, typingUsers, onlineDoctors, fetchMessages } = useContext(ChatContext);
  const { userData } = useContext(AppContext);
  const [hasMore, setHasMore] = useState(true);

  const doc = conversation?.docId;
  const isOnline = onlineDoctors.includes(doc?._id);
  const isTyping = !!typingUsers[conversation?._id];

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation?._id) {
      const loadMessages = async () => {
        const msgs = await fetchMessages(conversation._id);
        setMessages(msgs);
        setHasMore(msgs.length >= 30);
        markAsRead(conversation._id);
      };
      loadMessages();
    }
  }, [conversation?._id]);

  const handleSend = useCallback(async (text) => {
    if (conversation?._id) {
      try {
        await sendMessage(conversation._id, text);
      } catch (err) {
        console.error("Failed to send:", err);
      }
    }
  }, [conversation?._id, sendMessage]);

  const handleTyping = useCallback(() => {
    if (conversation?._id) emitTyping(conversation._id);
  }, [conversation?._id, emitTyping]);

  const handleStopTyping = useCallback(() => {
    if (conversation?._id) emitStopTyping(conversation._id);
  }, [conversation?._id, emitStopTyping]);

  const handleLoadMore = useCallback(async () => {
    if (messages.length > 0 && conversation?._id) {
      const oldest = messages[0]?.createdAt;
      const olderMsgs = await fetchMessages(conversation._id, oldest);
      if (olderMsgs.length < 30) setHasMore(false);
      setMessages((prev) => [...olderMsgs, ...prev]);
    }
  }, [messages, conversation?._id, fetchMessages, setMessages]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Select a conversation</p>
          <p className="text-gray-300 text-sm mt-1">Choose a doctor to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        name={doc?.name}
        image={doc?.image}
        speciality={doc?.speciality}
        isOnline={isOnline}
        onBack={onBack}
      />
      <MessageList
        messages={messages}
        currentUserId={userData?._id}
        isTyping={isTyping}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
      />
      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </div>
  );
}

export default ChatWindow;
