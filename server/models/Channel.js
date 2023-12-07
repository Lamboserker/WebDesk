import mongoose, { Schema } from "mongoose";

const ChannelSchema = new Schema({
  name: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace" },
  activeMeetingId: { type: String, default: null },
});

const Channel = mongoose.model("Channel", ChannelSchema);
export default Channel;
