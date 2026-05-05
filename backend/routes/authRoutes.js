const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { sendInviteEmail } = require("../config/emailService");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-image", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(200).json({ imageUrl: req.file.path });
});

router.post("/invite", protect, adminOnly, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await sendInviteEmail({
      toEmail: email,
      inviterName: req.user.name,
      inviteToken: process.env.ADMIN_INVITE_TOKEN,
    });

    res.json({ message: "Invite sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send invite" });
  }
});

module.exports = router;