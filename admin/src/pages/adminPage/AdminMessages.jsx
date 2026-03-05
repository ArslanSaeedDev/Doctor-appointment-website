import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ChatContext } from '../../context/ChatContext';
import ConversationItem from '../../components/chat/ConversationItem';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';

function AdminMessages() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    setMessages,
    fetchMessages,
    onlineUsers,
    onlineDoctors,
  } = useContext(ChatContext);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (activeConversation?._id) {
      const loadMessages = async () => {
        const msgs = await fetchMessages(activeConversation._id);
        setMessages(msgs);
        setHasMore(msgs.length >= 30);
      };
      loadMessages();
    }
  }, [activeConversation?._id]);

  const handleLoadMore = useCallback(async () => {
    if (messages.length > 0 && activeConversation?._id) {
      const oldest = messages[0]?.createdAt;
      const olderMsgs = await fetchMessages(activeConversation._id, oldest);
      if (olderMsgs.length < 30) setHasMore(false);
      setMessages((prev) => [...olderMsgs, ...prev]);
    }
  }, [messages, activeConversation?._id, fetchMessages, setMessages]);

  const user = activeConversation?.userId;
  const doc = activeConversation?.docId;

  return (
    <div className="flex h-[calc(100vh-100px)] border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* All Conversations List */}
      <div className="w-80 flex-shrink-0 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">All Conversations</h2>
          <p className="text-xs text-gray-400 mt-1">Monitor all patient-doctor chats (Read-only)</p>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-400 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv._id}
                name={`${conv.userId?.name || 'Patient'} - ${conv.docId?.name || 'Doctor'}`}
                image={conv.userId?.image}
                subtitle={conv.docId?.speciality}
                lastMessage={conv.lastMessage}
                unread={0}
                isActive={activeConversation?._id === conv._id}
                isOnline={onlineUsers.includes(conv.userId?._id)}
                onClick={() => setActiveConversation(conv)}
              />
            ))
          )}
        </div>
      </div>

      {/* Read-Only Chat View */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex items-center justify-between p-3 border-b bg-white">
              <div className="flex items-center gap-3">
                <div>
                  <img src={user?.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{user?.name} &harr; {doc?.name}</p>
                  <p className="text-xs text-gray-400">{doc?.speciality} | Read-only view</p>
                </div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Admin View</span>
            </div>
            <MessageList
              messages={messages}
              currentUserId={null}
              isTyping={false}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />
            <div className="p-3 border-t bg-gray-50 text-center">
              <p className="text-xs text-gray-400">Admin view is read-only. You cannot send messages.</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-lg">Select a conversation</p>
              <p className="text-gray-300 text-sm mt-1">Choose a conversation to monitor</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
