import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
      index: true,
    },
    senderId: { type: String, required: true },
    senderType: { type: String, enum: ["user", "doctor"], required: true },
    text: { type: String, required: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;
