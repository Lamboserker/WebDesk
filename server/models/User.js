import mongoose, { Schema, Types } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  profileImage: { type: String }, // Hinzugefügtes Attribut für das Profilbild
});

const User = mongoose.model("User", UserSchema);
export default User;
