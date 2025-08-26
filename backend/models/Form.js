import mongoose from "mongoose";

const filedSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ["text", "checkbox"], required: true },
  options: [String],
  required: { type: Boolean, default: false },
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileds: [filedSchema],
  requireLogin: { type: Boolean, default: false },
  allowAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
  ownerEmail: { type: String },
  ownerTokenHash: { type: String },
  ownerTokenExpireAt: { type: Date },
});

export default mongoose.model("Form", formSchema);
