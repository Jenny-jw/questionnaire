import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import formsRouter from "./routes/forms.js";
import formAdminsRouter from "./routes/adminForms.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(cookieParser());
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: err.message });
});

app.use("/api/forms", formsRouter);
app.use("/api/admin/forms", formAdminsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🚀`);
});
