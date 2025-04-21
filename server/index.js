const express = require("express");
const router = express.Router();
const { getObjectURL } = require("../services/s3");

// Route to get a signed URL for an S3 object
router.get("/getObjectURL", async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Key is required" });
  }

  try {
    const url = await getObjectURL(key);
    res.status(200).json({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

module.exports = router;