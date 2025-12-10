import mongoose from "mongoose";

// Just for form creator
const creatorSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  tokenHash: { type: String },
  tokenExpireAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Creator", creatorSchema);
