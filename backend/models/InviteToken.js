import mongoose from "mongoose";

const inviteTokenSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  token: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("InviteToken", inviteTokenSchema);
