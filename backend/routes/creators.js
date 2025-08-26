import express from "express";

const router = express.Router();

// Maybe don't need...?
// POST /api/creators/register, new a creator
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/creators/register,

const creatorsRouter = router;
export default creatorsRouter;
