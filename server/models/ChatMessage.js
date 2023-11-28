import mongoose, { Schema, Types } from "mongoose";

const MessageSchema = new Schema({
  content: { type: String, required: true },
  channel: { type: Schema.Types.ObjectId, ref: "Channel" },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
