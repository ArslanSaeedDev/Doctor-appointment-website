import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { AppContext } from "./AppContext";
import axios from "axios";

export const ChatContext = createContext();

export const ChatContextProvider = (props) => {
  const { token, backendUrl } = useContext(AppContext);
  const [socket, setSocket] = useState(null);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const activeConvRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => {
    activeConvRef.current = activeConversation;
  }, [activeConversation]);

  // Calculate total unread count
  useEffect(() => {
    const total = conversations.reduce((sum, conv) => sum + (conv.userUnread || 0), 0);
    setUnreadCount(total);
  }, [conversations]);

  // Fetch conversations via REST
  const refreshConversations = useCallback(async () => {
    if (!token || !backendUrl) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/chat/user-conversations`, {
        headers: { token },
      });
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [token, backendUrl]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId, before) => {
    if (!backendUrl) return [];
    try {
      let url = `${backendUrl}/api/chat/messages/${conversationId}?limit=30`;
      if (before) url += `&before=${before}`;
      const { data } = await axios.get(url);
      if (data.success) {
        return data.messages;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    return [];
  }, [backendUrl]);

  // Connect socket when token is available
  useEffect(() => {
    if (token && backendUrl) {
      const newSocket = io(backendUrl, {
        auth: { token, tokenType: "user" },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
        refreshConversations();
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      newSocket.on("onlineStatus", ({ onlineDoctors: docs }) => {
        setOnlineDoctors(docs);
      });

      newSocket.on("newMessage", ({ message, conversationId }) => {
        if (activeConvRef.current?._id === conversationId) {
          setMessages((prev) => [...prev, message]);
        }
        refreshConversations();
      });

      newSocket.on("userTyping", ({ conversationId, senderId, senderType }) => {
        if (senderType === "doctor") {
          setTypingUsers((prev) => ({ ...prev, [conversationId]: senderId }));
        }
      });

      newSocket.on("userStopTyping", ({ conversationId, senderType }) => {
        if (senderType === "doctor") {
          setTypingUsers((prev) => {
            const updated = { ...prev };
            delete updated[conversationId];
            return updated;
          });
        }
      });

      newSocket.on("messagesRead", ({ conversationId }) => {
        if (activeConvRef.current?._id === conversationId) {
          setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
        }
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        socketRef.current = null;
      };
    }
  }, [token, backendUrl]);

  // Load conversations when token changes
  useEffect(() => {
    if (token) {
      refreshConversations();
    } else {
      setConversations([]);
      setMessages([]);
      setActiveConversation(null);
    }
  }, [token, refreshConversations]);

  const sendMessage = useCallback((conversationId, text) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject("No socket connection");
      socketRef.current.emit("sendMessage", { conversationId, text }, (response) => {
        if (response.error) reject(response.error);
        else {
          setMessages((prev) => [...prev, response.message]);
          refreshConversations();
          resolve(response.message);
        }
      });
    });
  }, [refreshConversations]);

  const emitTyping = useCallback((conversationId) => {
    socketRef.current?.emit("typing", { conversationId });
  }, []);

  const emitStopTyping = useCallback((conversationId) => {
    socketRef.current?.emit("stopTyping", { conversationId });
  }, []);

  const markAsRead = useCallback((conversationId) => {
    socketRef.current?.emit("markRead", { conversationId });
  }, []);

  const value = {
    socket,
    onlineDoctors,
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    messages,
    setMessages,
    typingUsers,
    unreadCount,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markAsRead,
    refreshConversations,
    fetchMessages,
  };

  return <ChatContext.Provider value={value}>{props.children}</ChatContext.Provider>;
};

export default ChatContextProvider;
