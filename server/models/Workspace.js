import mongoose, { Schema, Types } from "mongoose";

const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  owner: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  members: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  channels: [
    {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
  chatMessages: [
    {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
  ],
  videoCalls: [
    {
      type: Types.ObjectId,
      ref: "VideoCall",
    },
  ],
});

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;
