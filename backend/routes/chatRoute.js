import express from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getDoctorConversations,
  getAllConversations,
  getMessages,
} from "../controllers/chatController.js";
import authUser from "../middlewares/authUser.js";
import authDoctor from "../middlewares/authDoctor.js";
import authAdmin from "../middlewares/authAdmin.js";

const chatRouter = express.Router();

// User endpoints
chatRouter.post("/conversation", authUser, getOrCreateConversation);
chatRouter.get("/user-conversations", authUser, getUserConversations);

// Doctor endpoints
chatRouter.get("/doctor-conversations", authDoctor, getDoctorConversations);

// Admin endpoints
chatRouter.get("/all-conversations", authAdmin, getAllConversations);

// Messages endpoint
chatRouter.get("/messages/:conversationId", getMessages);

export default chatRouter;
