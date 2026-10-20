import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  uploadAvatar,
} from "../controllers/userController.js";
import { protect, adminOnly, envAdminOnly } from "../middlewares/authMiddleware.js";

const router = Router();

const avatarDir = "uploads/avatars";
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars/"),
  filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = [".jpg", ".jpeg", ".png"].includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error("Only JPG and PNG files are allowed."), ok);
  },
});

router.get("/profile",  protect,            getProfile);
router.put("/profile",  protect,            updateProfile);
router.post("/avatar",  protect, upload.single("avatar"), uploadAvatar);
router.get("/",         protect, adminOnly, getAllUsers);
router.patch("/:id/promote", protect, adminOnly, envAdminOnly, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.role = "admin";
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/demote", protect, adminOnly, envAdminOnly, async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.role = "guest";
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
