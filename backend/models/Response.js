import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  userTokenHash: { type: String, required: true },
  answers: { type: Object, required: true },
  isAnonymous: { type: Boolean, default: true },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Response", responseSchema);
