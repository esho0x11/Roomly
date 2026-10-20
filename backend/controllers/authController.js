import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper to sign a JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/auth/register ─────────────────────────────────
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, national_id } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone?.trim();
    const normalizedNationalId = national_id?.trim();

    if (!first_name || !last_name || !normalizedEmail || !password || !normalizedPhone || !normalizedNationalId) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
        { national_id: normalizedNationalId },
      ],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(409).json({ message: "Email is already registered." });
      }
      if (existingUser.phone === normalizedPhone) {
        return res.status(409).json({ message: "Phone number is already registered." });
      }
      if (existingUser.national_id === normalizedNationalId) {
        return res.status(409).json({ message: "National ID is already registered." });
      }
    }

    const user = await User.create({
      first_name,
      last_name,
      email: normalizedEmail,
      password,
      phone: normalizedPhone,
      national_id: normalizedNationalId,
      role: "guest",
    });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/auth/login ────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "invalid email or password." });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/auth/me ────────────────────────────────────────
export const getMe = (req, res) => {
  res.json({ user: req.user });
};
