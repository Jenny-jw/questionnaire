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
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Creater" },
  requireLogin: { type: Boolean, default: false },
  allowAnonymouse: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Form", formSchema);
