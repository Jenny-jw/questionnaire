import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Creator from "../models/Creator.js";
import Form from "../models/Form.js";

dotenv.config();

const adminAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.adminToken;
    if (!token) return res.status(401).json({ message: "Admin token found" });

    // Verify JWT
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired admin token" });
    }

    // Find creator
    const { creatorId } = payload;
    const creator = await Creator.findById(creatorId);
    if (!creator) return res.status(401).json({ error: "Creator not found" });

    // Check if token had expired
    if (!creator.tokenExpireAt || creator.tokenExpireAt < new Date()) {
      return res.status(401).json({ error: "Admin token expired" });
    }

    // Compare token hash
    const isMatch = await bcrypt.compare(token, creator.tokenHash);
    if (!isMatch)
      return res.status(401).json({ error: "Admin token mismatch" });

    // Check if the form belongs to the creator
    if (req.params.formId) {
      const form = await Form.findById(req.params.formId);
      if (!form) return res.status(404).json({ error: "Form not found" });
      if (form.creator.toString() !== creator._id.toString()) {
        return res.status(403).json({ error: "Not authorized for this form" });
      }
      // for future usage
      req.form = form;
    }

    // Add admin to request
    req.admin = creator;

    next();
  } catch (err) {
    console.error("adminAuth error:", err);
    res.status(500).json({ error: "Admin auth failed" });
  }
};

export default adminAuth;
