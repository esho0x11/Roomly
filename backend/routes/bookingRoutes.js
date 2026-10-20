import { Router } from "express";
import {
  getMyBookings,
  getAllBookings,
  getRoomAvailability,
  createBooking,
  cancelBooking,
  approveBooking,
  rejectBooking,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = Router();

// NOTE: /my must be defined BEFORE /:id to avoid route conflicts
router.get("/my",  protect,             getMyBookings);
router.get("/room/:roomId/availability", getRoomAvailability);
router.get("/",    protect, adminOnly,  getAllBookings);
router.post("/",   protect,             createBooking);
router.patch("/:id/cancel", protect,   cancelBooking);
router.patch("/:id/approve", protect, adminOnly, approveBooking);
router.patch("/:id/reject",  protect, adminOnly, rejectBooking);

export default router;
