import mongoose, { Schema, Types } from 'mongoose';

const ChatMessageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  channel: {
    type: Types.ObjectId,
    required: true,
    ref: 'Channel'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export default ChatMessage;
