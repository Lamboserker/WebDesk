import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  profileImage: { 
    type: String,
    default: 'path_to_default_profile_image' // Pfad zum Standardprofilbild
  },
  // Optional: Weitere Felder hinzufügen
  bio: { type: String },
  location: { type: String }
});

const User = mongoose.model("User", UserSchema);
export default User;
