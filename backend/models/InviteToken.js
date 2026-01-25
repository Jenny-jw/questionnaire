import mongoose from "mongoose";

const inviteTokenSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  inviteToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// token unique
inviteTokenSchema.index({ inviteToken: 1 }, { unique: true });
// time to live (TTL) cleanup
inviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("InviteToken", inviteTokenSchema);
