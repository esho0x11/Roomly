import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Document from "../models/Document.js";

const refreshCompletedBookings = async (match = {}) => {
  const now = new Date();
  await Booking.updateMany(
    {
      ...match,
      status: "Upcoming",
      endDate: { $lt: now },
    },
    { $set: { status: "Completed" } }
  );
};

// ── GET /api/bookings/my ────────────────────────────────────
// Authenticated user — their own bookings
export const getMyBookings = async (req, res) => {
  try {
    await refreshCompletedBookings({ userId: req.user._id });
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("roomId")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/bookings ───────────────────────────────────────
// Admin only — all bookings
export const getAllBookings = async (req, res) => {
  try {
    await refreshCompletedBookings();
    const bookings = await Booking.find()
      .populate("userId", "first_name last_name email")
      .populate("roomId")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/bookings/room/:roomId/availability ───────────
// Public — returns if room is available now, and next available date if not
export const getRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    await refreshCompletedBookings({ roomId });

    const now = new Date();

    const activeBooking = await Booking.findOne({
      roomId,
      status: "Upcoming",
      startDate: { $lte: now },
      endDate: { $gt: now },
    }).sort({ endDate: 1 });

    const lastBooking = await Booking.findOne({
      roomId,
      status: "Upcoming",
    }).sort({ endDate: -1 });

    const availableFrom = lastBooking ? lastBooking.endDate : null;
    const availableNow = !activeBooking;

    res.json({ availableNow, availableFrom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/bookings ──────────────────────────────────────
// Authenticated — create a new booking
export const createBooking = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found." });

    const start = new Date(startDate);
    const end   = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ message: "Check-out date must be after check-in date." });
    }

    // Check for overlapping active bookings on this room
    const conflict = await Booking.findOne({
      roomId,
      status: { $ne: "Cancelled" },
      $or: [
        { startDate: { $lt: end,   $gte: start } },
        { endDate:   { $gt: start, $lte: end   } },
        { startDate: { $lte: start }, endDate: { $gte: end } },
      ],
    });

    if (conflict) {
      return res.status(409).json({ message: "Room is already booked for those dates." });
    }

    const lastUpcoming = await Booking.findOne({
      roomId,
      status: "Upcoming",
      endDate: { $gt: new Date() },
    }).sort({ endDate: -1 });

    if (lastUpcoming && start < lastUpcoming.endDate) {
      return res.status(409).json({
        message: `Room is not available until ${lastUpcoming.endDate.toLocaleDateString()}.`,
      });
    }

    // Calculate total price with discount
    const nights      = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const discounted  = room.pricePerNight * (1 - room.discountRate / 100);
    const totalPrice  = Math.round(discounted * nights);

    const userDocs = await Document.findOne({ user: req.user._id });
    if (!userDocs) {
      return res.status(400).json({ message: "Please upload your ID documents first." });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      roomId,
      startDate: start,
      endDate: end,
      totalPrice,
      approvalStatus: "Pending",
      idDocs: { front: userDocs.front, back: userDocs.back },
      status: "Upcoming",
    });

    res.status(201).json({ booking, totalPrice, nights });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── PATCH /api/bookings/:id/approve ────────────────────────
// Admin only — approve a booking
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    booking.approvalStatus = "Approved";
    booking.rejectReason = undefined;
    await booking.save();

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PATCH /api/bookings/:id/reject ─────────────────────────
// Admin only — reject a booking
export const rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    booking.approvalStatus = "Rejected";
    booking.status = "Cancelled";
    booking.rejectReason = reason.trim();
    await booking.save();

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PATCH /api/bookings/:id/cancel ─────────────────────────
// Owner or admin — cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    const isOwner = booking.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to cancel this booking." });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
