import mongoose, { Schema, Types } from 'mongoose';

const ChannelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  workspace: {
    type: Types.ObjectId,
    required: true,
    ref: 'Workspace'
  },
  members: [{
    type: Types.ObjectId,
    ref: 'User'
  }]
});

const Channel = mongoose.model('Channel', ChannelSchema);
export default Channel;
