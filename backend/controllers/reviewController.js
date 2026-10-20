import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// ── GET /api/reviews/room/:roomId ───────────────────────────
// Public — get all reviews for a specific room
export const getRoomReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ roomId: req.params.roomId })
      .populate("userId", "first_name last_name")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/reviews/my ────────────────────────────────────
// Authenticated — get all reviews authored by current user
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate("roomId", "title location city images type")
      .sort({ createdAt: -1 })
      .lean();

    const missingRoomIds = reviews
      .filter((r) => r.roomId && typeof r.roomId === "string")
      .map((r) => r.roomId);

    if (missingRoomIds.length) {
      const rooms = await Room.find({ _id: { $in: missingRoomIds } })
        .select("title location city images type")
        .lean();

      const roomMap = new Map(rooms.map((room) => [String(room._id), room]));
      reviews.forEach((r) => {
        if (r.roomId && typeof r.roomId === "string") {
          r.roomId = roomMap.get(r.roomId) || r.roomId;
        }
      });
    }

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/reviews ───────────────────────────────────────
// Authenticated — user must have a COMPLETED booking for the room
export const createReview = async (req, res) => {
  try {
    const { roomId, rating, comment } = req.body;

    // Business rule: only guests who booked the room can review
    const booking = await Booking.findOne({
      userId: req.user._id,
      roomId,
      status: { $ne: "Cancelled" },
    });

    if (!booking) {
      return res.status(403).json({
        message: "You can only review rooms you have booked.",
      });
    }

    // One review per user per room
    const existingReview = await Review.findOne({ userId: req.user._id, roomId });
    if (existingReview) {
      return res.status(409).json({ message: "You have already reviewed this room." });
    }

    const review = await Review.create({ userId: req.user._id, roomId, rating, comment });
    await review.populate("userId", "first_name last_name");

    res.status(201).json({ review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── DELETE /api/reviews/:id ─────────────────────────────────
// Owner or admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this review." });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
