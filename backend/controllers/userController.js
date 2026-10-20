import User from "../models/User.js";

// ── GET /api/users/profile ──────────────────────────────────
// Authenticated — return current user's profile
export const getProfile = (req, res) => {
  res.json({ user: req.user });
};

// ── PUT /api/users/profile ──────────────────────────────────
// Authenticated — update current user's profile
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, nationalIdImageLink, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { first_name, last_name, phone, nationalIdImageLink, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── GET /api/users ──────────────────────────────────────────
// Admin only — get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/users/avatar ─────────────────────────────────
// Authenticated — upload profile avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required." });
    }

    const avatarPath = "/uploads/avatars/" + req.file.filename;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
