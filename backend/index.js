import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import logging   from "./middlewares/logging.js";

import authRoutes     from "./routes/authRoutes.js";
import roomRoutes     from "./routes/roomRoutes.js";
import bookingRoutes  from "./routes/bookingRoutes.js";
import reviewRoutes   from "./routes/reviewRoutes.js";
import userRoutes     from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import adminRoutes    from "./routes/adminRoutes.js";

// ── Load environment variables ──────────────────────────────
dotenv.config();

// ── Connect to MongoDB ──────────────────────────────────────
connectDB();

// ── Initialize Express ──────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middlewares ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logging);

// ── API Routes ──────────────────────────────────────────────
app.use("/uploads",      express.static("uploads"));
app.use("/api/auth",     authRoutes);
app.use("/api/rooms",    roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews",  reviewRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);

// ── Health Check ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🏠 Roomly API is running." });
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
