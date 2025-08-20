import mongoose from "mongoose";

// Just for form creator
const creatorSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  role: { type: String, enum: ["creator", "user"], default: "creator" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Creator", creatorSchema);
