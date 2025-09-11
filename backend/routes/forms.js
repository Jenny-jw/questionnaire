import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Form from "../models/Form.js";
import InviteToken from "../models/InviteToken.js";
import Response from "../models/Response.js";
import crypto from "crypto";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();

/* APIs for Form Creators, verifyToken */
// 1. POST /api/forms, create a form
router.post("/", async (req, res) => {
  try {
    console.log("In POST, req.body: ");
    console.log(req.body);
    const {
      title,
      description,
      fields,
      owner,
      ownerEmail,
      requireLogin,
      allowAnonymous,
    } = req.body;
    const adminToken = jwt.sign({ owner, ownerEmail }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const tokenExpireAt = new Date(jwt.decode(adminToken).exp * 1000); // exp is UNIX timestamp (second), * 1000 to become JS Date (millisecond)

    // TODO: bcrypt.hash(adminToken)
    const dbField = fields.map((f) => ({
      question: f.question ?? "",
      type: f.type ?? "",
      options: Array.isArray(f.options) ? f.options : [],
      required: !!f.required,
    }));

    const ownerTokenHash = "1234567";

    const newForm = new Form({
      title,
      description,
      fields: dbField,
      owner: owner || undefined,
      ownerEmail, // When token lost, email-based recovery
      ownerTokenHash, // When token lost, email-based recovery
      ownerTokenExpireAt: tokenExpireAt,
      requireLogin,
      allowAnonymous,
    });
    const savedForm = await newForm.save();
    // Nodemailer: 用 email 把 token 寄給 admin（只存到信箱，不回傳前端）
    res.status(201).json({
      message:
        "Successfully created a form. Please save your token. The token will be expired in 7 days.",
      adminToken: adminToken,
      formId: savedForm._id,
      questionnaireLink: `https://myApp-on-render.com/forms/${savedForm._id}`,
    });
  } catch (err) {
    console.error("Error creating form:", err);
    res
      .status(500)
      .json({ error: "Fail to create a form", detail: err.message });
  }
});

// GET /api/forms, get all forms
router.get("/", async (req, res) => {
  // const { owner } = req.query;
});

// GET /api/forms/:id, check single form
router.get("/:id", async (req, res) => {});

// PATCH /api/forms/:id, modify a specific form
router.patch("/:id", async (req, res) => {});

// DELETE /api/forms/:id, delete a specific form
router.delete("/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ error: "Cannot find form" });
    res.json({ message: "Form has been deleted" });
  } catch (err) {
    res.status(500).json({ error: "Form deletion failed" });
  }
});

// GET /api/forms/:formId/responses, get all responses of a form
// GET /api/forms/:formId/responses/:responseId, get a response of a form
// DELETE /api/forms/:formId/responses/:responseId, delete a response of a form

/* APIs for Fillers */
// 流程: fillers拿到帶 token 的填答連結，例如 https://yourapp.com/forms/:formId/respond?token=abcdef123456

// 2. GET GET /api/forms/:formId, create an inviteToken when a filler open the questionnaire
router.get("/:id/invite", async (req, res) => {
  try {
    // create a token (crypto vs uuid)，存進 DB → InviteToken Schema (form, token, used, expiresAt)
    const relatedForm = await Form.findById(req.params.id);
    const inviteToken = crypto.randomBytes(16).toString("hex");
    const expTime = 24 * 60 * 60 * 1000; // ms in a day
    const newInviteToken = new InviteToken({
      relatedForm,
      inviteToken,
      used: false,
      expiresAt: new Date(Date.now() + expTime),
    });
    await newInviteToken.save();
    res.status(201).json({
      message: "The questionnaire will be expired in one day.",
      otp: inviteToken,
    });
  } catch (err) {
    res.status(500).json({ error: "Fail to ", detail: err.message });
  }
});

// 3. POST /api/forms/:formId/responses, add response, remove inviteToken
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
