import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";

// Get or create a conversation between user and doctor
const getOrCreateConversation = async (req, res) => {
  try {
    const { userId, docId } = req.body;

    let conversation = await conversationModel
      .findOne({ userId, docId })
      .populate("userId", "name image")
      .populate("docId", "name image speciality");

    if (!conversation) {
      conversation = new conversationModel({ userId, docId });
      await conversation.save();
      conversation = await conversationModel
        .findById(conversation._id)
        .populate("userId", "name image")
        .populate("docId", "name image speciality");
    }

    res.json({ success: true, conversation });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversations = await conversationModel
      .find({ userId })
      .populate("docId", "name image speciality")
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all conversations for a doctor
const getDoctorConversations = async (req, res) => {
  try {
    const { docId } = req.body;
    const conversations = await conversationModel
      .find({ docId })
      .populate("userId", "name image")
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all conversations (admin)
const getAllConversations = async (req, res) => {
  try {
    const conversations = await conversationModel
      .find({})
      .populate("userId", "name image")
      .populate("docId", "name image speciality")
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get messages for a conversation (cursor-based pagination)
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { before, limit = 30 } = req.query;

    const query = { conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await messageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getOrCreateConversation,
  getUserConversations,
  getDoctorConversations,
  getAllConversations,
  getMessages,
};
