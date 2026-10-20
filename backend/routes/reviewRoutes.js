import { Router } from "express";
import {
  getRoomReviews,
  getMyReviews,
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/room/:roomId", getRoomReviews);
router.get("/my",          protect, getMyReviews);
router.post("/",            protect, createReview);
router.delete("/:id",       protect, deleteReview);

export default router;
