import express from "express";
import dotenv from "dotenv";
import formsRouter from "./routes/forms.js";
import creatorsRouter from "./routes/creators.js";
import inviteTokensRouter from "./routes/inviteTokens.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/forms", formsRouter);
app.use("/api/creators", creatorsRouter);
app.use("/api/inviteTokens", inviteTokensRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} 🚀`);
});
