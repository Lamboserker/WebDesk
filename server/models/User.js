import mongoose, { Schema, Types } from 'mongoose';


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: false // Setzen Sie dies auf false, wenn das Profilbild optional sein soll
  },
  workspaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace' // Stellen Sie sicher, dass 'Workspace' Ihr Workspace-Modell ist
  }]
});

const User = mongoose.model('User', UserSchema);
export default User;