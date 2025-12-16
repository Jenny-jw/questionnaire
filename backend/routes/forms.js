import express from "express";
import dotenv from "dotenv";
import Form from "../models/Form.js";
import Response from "../models/Response.js";
import transporter from "../config/nodemailer.js";
import crypto, { hash } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

dotenv.config();

const router = express.Router();

// PUBLIC app.use("/api/forms", formsRouter);
// X | GET  /api/forms/:formId
// X | GET  /api/forms/:formId?token=xxx
// X | POST /api/forms/:formId

// GET /api/forms/:formId, access questionnaire
router.get("/forms/:formId", async (req, res) => {
  try {
    // create a token (crypto vs uuid)，存進 DB → InviteToken Schema (form, token, used, expiresAt)
    const relatedForm = await Form.findById(req.params.formId);
    const inviteToken = crypto.randomBytes(16).toString("hex");
    const expTime = 24 * 60 * 60 * 1000; // ms in a day
    // const newInviteToken = new InviteToken({
    //   form: relatedForm,
    //   token: inviteToken,
    //   used: false,
    //   expiresAt: new Date(Date.now() + expTime),
    // });
    // await newInviteToken.save();
    res.status(201).json({
      message: "The questionnaire will be expired in one day.",
      otp: inviteToken,
    });
  } catch (err) {
    res.status(500).json({ error: "Fail to ", detail: err.message });
  }
});

// ?? POST /api/forms/:formId/responses, add response, remove inviteToken
// 填答者打開時，前端會帶 token，後端驗證token是否存在？過期？已被使用？通過驗證後，才允許填答並建立 Response
router.post("/:id/response", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // Make sure saveResponse and updateToken and done / fail together
    await session.withTransaction(async () => {
      const relatedForm = await Form.findById(req.params.id);
      const { inviteToken, answers } = req.body;
      const tokenInDb = await InviteToken.findOne({
        token: inviteToken,
      }).session(session);

      if (!tokenInDb) throw new Error("Invalid invite token");
      if (tokenInDb.used) throw new Error("Token is alreadt used");
      if (tokenInDb.expiresAt < new Date())
        return res.status(400).json({ error: "Token is expired" });

      const newResponse = new Response({
        relatedForm,
        answers,
        token: inviteToken,
      });
      await newResponse.save({ session });

      tokenInDb.used = true;
      await tokenInDb.save({ session });

      res.json({ success: true });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});
// GET /api/forms/:id/respond?token=xxxx → 驗證 token 有效 → 回傳表單內容。
// POST /api/forms/:id/respond → 儲存答案，同時將 token 標記為已用。

const formsRouter = router;
export default formsRouter;
