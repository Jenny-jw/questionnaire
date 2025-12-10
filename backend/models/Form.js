import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ["shortAnswer", "paragraph", "multipleChoice", "checkboxes", "date"],
    required: true,
  },
  options: [String],
  required: { type: Boolean, default: false },
});

const formSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  fields: [fieldSchema],
  requireLogin: { type: Boolean, default: false },
  allowAnonymous: { type: Boolean, default: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Form", formSchema);
