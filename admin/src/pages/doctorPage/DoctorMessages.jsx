import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { DoctorContext } from '../../context/DoctorContext';
import ConversationItem from '../../components/chat/ConversationItem';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';

function DoctorMessages() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    setMessages,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markAsRead,
    typingUsers,
    onlineUsers,
    fetchMessages,
  } = useContext(ChatContext);
  const { profileData, doctorProfile } = useContext(DoctorContext);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!profileData) doctorProfile();
  }, []);

  const user = activeConversation?.userId;
  const isOnline = onlineUsers.includes(user?._id);
  const isTyping = !!typingUsers[activeConversation?._id];

  useEffect(() => {
    if (activeConversation?._id) {
      const loadMessages = async () => {
        const msgs = await fetchMessages(activeConversation._id);
        setMessages(msgs);
        setHasMore(msgs.length >= 30);
        markAsRead(activeConversation._id);
      };
      loadMessages();
    }
  }, [activeConversation?._id]);

  const handleSend = useCallback(async (text) => {
    if (activeConversation?._id) {
      try {
        await sendMessage(activeConversation._id, text);
      } catch (err) {
        console.error("Failed to send:", err);
      }
    }
  }, [activeConversation?._id, sendMessage]);

  const handleTyping = useCallback(() => {
    if (activeConversation?._id) emitTyping(activeConversation._id);
  }, [activeConversation?._id, emitTyping]);

  const handleStopTyping = useCallback(() => {
    if (activeConversation?._id) emitStopTyping(activeConversation._id);
  }, [activeConversation?._id, emitStopTyping]);

  const handleLoadMore = useCallback(async () => {
    if (messages.length > 0 && activeConversation?._id) {
      const oldest = messages[0]?.createdAt;
      const olderMsgs = await fetchMessages(activeConversation._id, oldest);
      if (olderMsgs.length < 30) setHasMore(false);
      setMessages((prev) => [...olderMsgs, ...prev]);
    }
  }, [messages, activeConversation?._id, fetchMessages, setMessages]);

  return (
    <div className="flex h-[calc(100vh-100px)] border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Patient List */}
      <div className="w-80 flex-shrink-0 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Patient Messages</h2>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-400 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv._id}
                name={conv.userId?.name}
                image={conv.userId?.image}
                lastMessage={conv.lastMessage}
                unread={conv.docUnread || 0}
                isActive={activeConversation?._id === conv._id}
                isOnline={onlineUsers.includes(conv.userId?._id)}
                onClick={() => setActiveConversation(conv)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <ChatHeader
              name={user?.name}
              image={user?.image}
              isOnline={isOnline}
            />
            <MessageList
              messages={messages}
              currentUserId={profileData?._id}
              isTyping={isTyping}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />
            <MessageInput
              onSend={handleSend}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-lg">Select a conversation</p>
              <p className="text-gray-300 text-sm mt-1">Choose a patient to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorMessages;
