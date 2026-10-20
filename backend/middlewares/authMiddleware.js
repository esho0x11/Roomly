import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── Protect: verifies JWT and attaches user to req ──────────
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.admin === true && decoded?.role === "admin") {
      req.user = {
        _id: decoded.id || "admin",
        role: "admin",
        email: decoded.email || process.env.ADMIN_PANEL_EMAIL || "admin",
        first_name: "Admin",
        last_name: "Panel",
        canManageUsers: decoded.canManageUsers === true,
      };
      return next();
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const envAdminOnly = (req, res, next) => {
  if (!req.user?.canManageUsers) {
    return res.status(403).json({ message: "Access denied. Only the main admin account can manage admin roles." });
  }
  next();
};

// ── AdminOnly: must be used AFTER protect ───────────────────
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
