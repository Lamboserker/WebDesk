import mongoose, { Schema, Types } from "mongoose";

const ChatMessageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
export default ChatMessage;
