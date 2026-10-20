import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadId, getMyDocuments } from "../controllers/documentController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/ids/"),
  filename:    (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = [".jpg", ".jpeg", ".png", ".pdf"].includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error("Only JPG, PNG, and PDF files are allowed."), ok);
  },
});

const router = express.Router();

router.post("/upload", protect, upload.any(), uploadId);
router.get("/me",      protect, getMyDocuments);

export default router;
