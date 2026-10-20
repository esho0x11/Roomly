import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signAdminToken = (email) =>
  jwt.sign({ id: "admin", role: "admin", admin: true, email, canManageUsers: true }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // First, allow the env-defined admin account
    if (process.env.ADMIN_PANEL_EMAIL && process.env.ADMIN_PANEL_PASSWORD) {
      const isEmailOk = email.trim().toLowerCase() === process.env.ADMIN_PANEL_EMAIL.trim().toLowerCase();
      const isPasswordOk = password === process.env.ADMIN_PANEL_PASSWORD;
      if (isEmailOk && isPasswordOk) {
        const token = signAdminToken(process.env.ADMIN_PANEL_EMAIL);
        return res.json({
          token,
          user: {
            _id: "admin",
            first_name: "Admin",
            last_name: "Panel",
            email: process.env.ADMIN_PANEL_EMAIL,
            role: "admin",
            canManageUsers: true,
          },
        });
      }
    }

    // Otherwise, try to authenticate against real users in DB
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
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
        canManageUsers: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
