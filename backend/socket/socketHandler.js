import { socketAuthMiddleware } from "./socketAuth.js";
import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

const onlineUsers = new Map();
const onlineDoctors = new Map();

export const setupSocketHandlers = (io) => {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.userType} - ${socket.userId || socket.docId || "admin"}`);

    // Register online and join personal room
    if (socket.userType === "user") {
      onlineUsers.set(socket.userId, socket.id);
      socket.join(`user_${socket.userId}`);
    } else if (socket.userType === "doctor") {
      onlineDoctors.set(socket.docId, socket.id);
      socket.join(`doctor_${socket.docId}`);
    } else if (socket.userType === "admin") {
      socket.join("admin_room");
    }

    // Broadcast online status
    io.emit("onlineStatus", {
      onlineUsers: Array.from(onlineUsers.keys()),
      onlineDoctors: Array.from(onlineDoctors.keys()),
    });

    // --- SEND MESSAGE ---
    socket.on("sendMessage", async (data, callback) => {
      try {
        const { conversationId, text } = data;
        const senderId = socket.userId || socket.docId;
        const senderType = socket.userType;

        if (!text || text.trim().length === 0) {
          return callback({ error: "Message cannot be empty" });
        }

        if (text.length > 2000) {
          return callback({ error: "Message too long (max 2000 characters)" });
        }

        // Save message
        const message = new messageModel({
          conversationId,
          senderId,
          senderType,
          text: text.trim(),
        });
        await message.save();

        // Update conversation
        const conversation = await conversationModel.findById(conversationId);
        if (!conversation) {
          return callback({ error: "Conversation not found" });
        }

        conversation.lastMessage = text.trim();
        conversation.lastMessageAt = new Date();

        if (senderType === "user") {
          conversation.docUnread += 1;
        } else {
          conversation.userUnread += 1;
        }
        await conversation.save();

        // Lookup sender info for notification
        let senderName = "Someone";
        let senderImage = "";
        if (senderType === "user") {
          const user = await userModel.findById(senderId).select("name image");
          if (user) { senderName = user.name; senderImage = user.image; }
        } else {
          const doctor = await doctorModel.findById(senderId).select("name image");
          if (doctor) { senderName = doctor.name; senderImage = doctor.image; }
        }

        const messageData = message.toObject();

        // Emit to recipient
        const recipientRoom =
          senderType === "user"
            ? `doctor_${conversation.docId}`
            : `user_${conversation.userId}`;

        io.to(recipientRoom).emit("newMessage", {
          message: messageData,
          conversationId,
          senderName,
          senderImage,
        });

        // Emit to admin room
        io.to("admin_room").emit("newMessage", {
          message: messageData,
          conversationId,
          senderName,
          senderImage,
        });

        callback({ success: true, message: messageData });
      } catch (error) {
        console.error("sendMessage error:", error);
        callback({ error: "Failed to send message" });
      }
    });

    // --- TYPING INDICATORS ---
    socket.on("typing", ({ conversationId }) => {
      const senderId = socket.userId || socket.docId;
      const senderType = socket.userType;
      socket.broadcast.emit("userTyping", { conversationId, senderId, senderType });
    });

    socket.on("stopTyping", ({ conversationId }) => {
      const senderId = socket.userId || socket.docId;
      const senderType = socket.userType;
      socket.broadcast.emit("userStopTyping", { conversationId, senderId, senderType });
    });

    // --- MARK MESSAGES AS READ ---
    socket.on("markRead", async ({ conversationId }) => {
      try {
        const readerType = socket.userType;
        const update = readerType === "user" ? { userUnread: 0 } : { docUnread: 0 };

        await conversationModel.findByIdAndUpdate(conversationId, update);

        const senderTypeToMark = readerType === "user" ? "doctor" : "user";
        await messageModel.updateMany(
          { conversationId, senderType: senderTypeToMark, read: false },
          { read: true }
        );

        const conversation = await conversationModel.findById(conversationId);
        if (conversation) {
          const recipientRoom =
            readerType === "user"
              ? `doctor_${conversation.docId}`
              : `user_${conversation.userId}`;

          io.to(recipientRoom).emit("messagesRead", { conversationId, readBy: readerType });
        }
      } catch (error) {
        console.error("markRead error:", error);
      }
    });

    // --- DISCONNECT ---
    socket.on("disconnect", () => {
      if (socket.userType === "user") {
        onlineUsers.delete(socket.userId);
      } else if (socket.userType === "doctor") {
        onlineDoctors.delete(socket.docId);
      }

      io.emit("onlineStatus", {
        onlineUsers: Array.from(onlineUsers.keys()),
        onlineDoctors: Array.from(onlineDoctors.keys()),
      });

      console.log(`Socket disconnected: ${socket.userType}`);
    });
  });
};
