import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ChatContext } from '../context/ChatContext';
import ConversationList from '../Compenents/chat/ConversationList';
import ChatWindow from '../Compenents/chat/ChatWindow';
import axios from 'axios';
import { toast } from 'react-toastify';

function Chat() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AppContext);
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    onlineDoctors,
    refreshConversations,
  } = useContext(ChatContext);
  const [showList, setShowList] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      toast.warn("Please login to access messages");
      navigate('/login');
    }
  }, [token, navigate]);

  // If docId is provided in URL, create/get conversation with that doctor
  useEffect(() => {
    if (docId && token && backendUrl) {
      const initConversation = async () => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/chat/conversation`,
            { docId },
            { headers: { token } }
          );
          if (data.success) {
            setActiveConversation(data.conversation);
            setShowList(false);
            refreshConversations();
          }
        } catch (error) {
          console.error("Error creating conversation:", error);
          toast.error("Failed to start conversation");
        }
      };
      initConversation();
    }
  }, [docId, token, backendUrl]);

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    setShowList(false);
  };

  const handleBack = () => {
    setShowList(true);
    setActiveConversation(null);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Conversation List - hide on mobile when chat is active */}
      <div className={`w-full sm:w-80 sm:flex-shrink-0 ${showList ? 'block' : 'hidden sm:block'}`}>
        <ConversationList
          conversations={conversations}
          activeId={activeConversation?._id}
          onlineDoctors={onlineDoctors}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Chat Window - hide on mobile when list is shown */}
      <div className={`flex-1 ${showList ? 'hidden sm:flex' : 'flex'} flex-col`}>
        <ChatWindow
          conversation={activeConversation}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

export default Chat;
