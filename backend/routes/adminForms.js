import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Form from "../models/Form.js";
import Creator from "../models/Creator.js";
import InviteToken from "../models/InviteToken.js";
import bcrypt from "bcrypt";
import adminAuth from "../middleware/adminAuth.js";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();
// ADMIN app.use("/api/admin/forms", formAdminsRouter);
// DONE | GET /api/admin/forms/:formId, preview questionnaire
// DONE | POST  /api/admin/forms
// X | POST  /api/admin/forms/:formId/invite
// X | GET  /api/admin/forms/:formId, read results
// X | PATCH  /api/admin/forms/:formId
// X | DELETE /api/admin/forms/:formId

// GET /api/admin/forms/:formId, preview questionnaire
router.get("/:formId", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
    return res.status(400).json({ error: "Invalid formId" });
  }

  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: "Form not found." });
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ error: "Fail to ", detail: err.message });
  }
});

// POST /api/admin/forms, create a form
router.post("/", async (req, res) => {
  try {
    const { title, description, fields, email, requireLogin, allowAnonymous } =
      req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Find or create a creator
    let creator = await Creator.findOne({ email });
    if (!creator) creator = await Creator.create({ email });

    // Generate admin token
    const adminToken = jwt.sign(
      { creatorId: creator._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    const tokenExpireAt = new Date(jwt.decode(adminToken).exp * 1000); // exp is UNIX timestamp (second), * 1000 to become JS Date (millisecond)

    // Hash token
    const tokenHash = await bcrypt.hash(adminToken, 10);

    creator.tokenHash = tokenHash;
    creator.tokenExpireAt = tokenExpireAt;
    await creator.save();

    // Sanitize fields
    const sanitizedFields = fields.map((f) => ({
      question: f.question ?? "",
      type: f.type ?? "",
      options: Array.isArray(f.options) ? f.options : [],
      required: !!f.required,
    }));

    // Create and save form
    const newForm = new Form({
      title,
      description,
      fields: sanitizedFields,
      creator: creator._id,
      requireLogin,
      allowAnonymous,
    });
    const savedForm = await newForm.save();

    // Send mailgun email with nodemailer
    // await transporter.sendMail({
    //   from: `Your App <${process.env.GMAIL_USER}>`,
    //   to: email,
    //   subject: "Your Admin Token",
    //   html: `
    //     <p>Your form has been created successfully.</p>
    //     <p><strong>Form ID:</strong> ${savedForm._id}</p>
    //     <p><strong>Admin Token (keep this safe for 7 days):</strong></p>
    //     <pre>${adminToken}</pre>
    //     <p>You can manage your form here:</p>
    //     <a href="${process.env.APP_URL}/admin/forms/${savedForm._id}">
    //       ${process.env.APP_URL}/admin/forms/${savedForm._id}
    //     </a>
    //   `,
    // });

    // Store adminToken in HttpOnly token
    res.cookie("adminToken", adminToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Return results
    return res.status(201).json({
      message:
        "Successfully created a form. Please check your email and save your token. The token will be expired in 7 days.",
      formId: savedForm._id,
      questionnaireLink: `${process.env.APP_URL}/forms/${savedForm._id}`,
    });
  } catch (err) {
    console.error("Error creating form:", err);
    res
      .status(500)
      .json({ error: "Fail to create a form", detail: err.message });
  }
});

// POST /api/admin/forms/:formId/invite, create a token for a filler
router.post("/:formId/invite", adminAuth, async (req, res) => {
  try {
    // Check if form exists
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ error: "Form not found" });

    // Create a token and save to DB
    const token = crypto.randomBytes(32).toString("hex");
    const expTime = 7 * 24 * 60 * 60 * 1000; // ms in 7 day
    const expiresAt = new Date(Date.now() + expTime);
    const newInviteToken = new InviteToken({
      form: form._id,
      token,
      expiresAt,
    });
    await newInviteToken.save();

    // Return link for sharing
    const inviteURL = `${process.env.APP_URL}/form/${formId}?token=${token}`;

    res.status(201).json({
      inviteURL,
      expiresAt,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to generate invite link",
      detail: err.message,
    });
  }
});

const formAdminsRouter = router;
export default formAdminsRouter;
