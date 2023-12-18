import mongoose, { Schema } from "mongoose";

const ChannelSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["textChannel", "voiceChannel", "forum", "announcement", "stage"],
  },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace" },
  activeMeetingId: { type: String, default: null },
  // Weitere feldspezifische Eigenschaften für bestimmte Channel-Typen können hier hinzugefügt werden
});

const Channel = mongoose.model("Channel", ChannelSchema);
export default Channel;
