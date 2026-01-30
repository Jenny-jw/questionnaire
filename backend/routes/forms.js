import express from "express";
import dotenv from "dotenv";
import Form from "../models/Form.js";
import Response from "../models/Response.js";
import mongoose from "mongoose";
import InviteToken from "../models/InviteToken.js";

dotenv.config();

const router = express.Router();

// PUBLIC app.use("/api/forms", formsRouter);
// DONE | GET  /api/forms/:formId?token=xxx
// DONE | POST /api/forms/:formId

// GET /api/forms/:formId?token=xxx, access questionnaire with inviteToken
router.get("/:formId", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
    return res.status(400).json({ error: "Invalid formId" });
  }

  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: "Form not found." });

    const { formId } = req.params;
    const { token } = req.query;
    const invite = await InviteToken.findOne({
      form: formId,
      inviteToken: token,
    });
    if (!invite) return res.status(403).json({ error: "Invalid token" });

    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ error: "Fail to ", detail: err.message });
  }
});

// POST /api/forms/:formId, add response, remove inviteToken
router.post("/:formId", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    // Make sure saveResponse and updateToken and done / fail together
    await session.withTransaction(async () => {
      const { formId } = req.params;
      const { inviteToken, answers } = req.body;

      const form = await Form.findById(formId).session(session);
      if (!form) throw new Error("Form not found");

      const token = await InviteToken.findOne({ InviteToken }).session(session);
      if (!token) throw new Error("Token not found");
      if (token.expiresAt < new Date()) throw new Error("Token expired");

      await Response.findOneAndUpdate(
        { inviteToken },
        { formId, answers },
        { upsert: true, new: true, session },
      );
      res.json({ success: true });

      // const relatedForm = await Form.findById(req.params.formId);
      // const { inviteToken, answers } = req.body;
      // const tokenInDb = await InviteToken.findOne({
      //   inviteToken,
      // }).session(session);

      // if (!tokenInDb) throw new Error("Invalid invite token");
      // if (tokenInDb.used) throw new Error("Token is alreadt used");
      // if (tokenInDb.expiresAt < new Date()) throw new Error("Token expired");

      // const response = new Response({
      //   relatedForm,
      //   answers,
      //   token: inviteToken,
      // });
      // await response.save({ session });
      // await tokenInDb.save({ session });

      // res.json({ success: true });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

const formsRouter = router;
export default formsRouter;
