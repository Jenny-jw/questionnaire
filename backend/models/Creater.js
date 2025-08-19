import mongoose from "mongoose";

// Just for admin / form creater
const createrSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  role: { type: String, enum: ["creater", "user"], default: "creater" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Creater", createrSchema);
