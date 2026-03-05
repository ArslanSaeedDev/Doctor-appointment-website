import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { AdminContext } from "./AdminContext";
import { DoctorContext } from "./DoctorContext";
import axios from "axios";

export const ChatContext = createContext();

export const ChatContextProvider = (props) => {
  const { aToken, backendUrl: adminBackendUrl } = useContext(AdminContext);
  const { dToken, backendUrl: doctorBackendUrl } = useContext(DoctorContext);
  const backendUrl = adminBackendUrl || doctorBackendUrl;

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const activeConvRef = useRef(null);

  useEffect(() => {
    activeConvRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    const total = conversations.reduce((sum, conv) => sum + (conv.docUnread || 0), 0);
    setUnreadCount(total);
  }, [conversations]);

  // Fetch conversations
  const refreshConversations = useCallback(async () => {
    if (!backendUrl) return;
    try {
      if (dToken) {
        const { data } = await axios.get(`${backendUrl}/api/chat/doctor-conversations`, {
          headers: { dToken },
        });
        if (data.success) setConversations(data.conversations);
      } else if (aToken) {
        const { data } = await axios.get(`${backendUrl}/api/chat/all-conversations`, {
          headers: { atoken: aToken },
        });
        if (data.success) setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [dToken, aToken, backendUrl]);

  // Fetch messages
  const fetchMessages = useCallback(async (conversationId, before) => {
    if (!backendUrl) return [];
    try {
      let url = `${backendUrl}/api/chat/messages/${conversationId}?limit=30`;
      if (before) url += `&before=${before}`;
      const { data } = await axios.get(url);
      if (data.success) return data.messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    return [];
  }, [backendUrl]);

  // Connect socket
  useEffect(() => {
    const token = dToken || aToken;
    const tokenType = dToken ? "doctor" : aToken ? "admin" : null;

    if (token && tokenType && backendUrl) {
      const newSocket = io(backendUrl, {
        auth: { token, tokenType },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log(`Socket connected as ${tokenType}`);
        refreshConversations();
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      newSocket.on("onlineStatus", ({ onlineUsers: users, onlineDoctors: docs }) => {
        setOnlineUsers(users);
        setOnlineDoctors(docs);
      });

      newSocket.on("newMessage", ({ message, conversationId }) => {
        if (activeConvRef.current?._id === conversationId) {
          setMessages((prev) => [...prev, message]);
        }
        refreshConversations();
      });

      newSocket.on("userTyping", ({ conversationId, senderId, senderType }) => {
        if (senderType === "user") {
          setTypingUsers((prev) => ({ ...prev, [conversationId]: senderId }));
        }
      });

      newSocket.on("userStopTyping", ({ conversationId, senderType }) => {
        if (senderType === "user") {
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
  }, [dToken, aToken, backendUrl]);

  useEffect(() => {
    if (dToken || aToken) {
      refreshConversations();
    } else {
      setConversations([]);
      setMessages([]);
      setActiveConversation(null);
    }
  }, [dToken, aToken, refreshConversations]);

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
    onlineUsers,
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
    isAdmin: !!aToken,
    isDoctor: !!dToken,
  };

  return <ChatContext.Provider value={value}>{props.children}</ChatContext.Provider>;
};

export default ChatContextProvider;
