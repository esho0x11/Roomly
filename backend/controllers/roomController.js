import Room from "../models/Room.js";
import Review from "../models/Review.js";

// ── GET /api/rooms ──────────────────────────────────────────
// Public | Query: ?city= &type= &minPrice= &maxPrice= &maxGuests=
export const getAllRooms = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, maxGuests } = req.query;
    const filter = {};
    const now = new Date();

    if (city)      filter.city      = { $regex: city, $options: "i" };
    if (type)      filter.type      = { $regex: type, $options: "i" };
    if (maxGuests) filter.maxGuests = { $gte: Number(maxGuests) };

    const priceMatch = {};
    if (minPrice) priceMatch.$gte = Number(minPrice);
    if (maxPrice) priceMatch.$lte = Number(maxPrice);

    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          discountedPrice: {
            $multiply: [
              "$pricePerNight",
              { $subtract: [1, { $divide: ["$discountRate", 100] }] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "bookings",
          let: { roomId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$roomId", "$$roomId"] },
                    { $eq: ["$status", "Upcoming"] },
                    { $gt: ["$endDate", now] },
                  ],
                },
              },
            },
            { $project: { startDate: 1, endDate: 1 } },
          ],
          as: "upcomingBookings",
        },
      },
      {
        $addFields: {
          lastCheckout: { $max: "$upcomingBookings.endDate" },
          activeBookingCount: {
            $size: {
              $filter: {
                input: "$upcomingBookings",
                as: "b",
                cond: {
                  $and: [
                    { $lte: ["$$b.startDate", now] },
                    { $gt: ["$$b.endDate", now] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          availableNow: { $eq: ["$activeBookingCount", 0] },
          availableFrom: "$lastCheckout",
        },
      },
    ];

    if (Object.keys(priceMatch).length > 0) {
      pipeline.push({ $match: { discountedPrice: priceMatch } });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const rooms = await Room.aggregate(pipeline);
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/rooms/:id ──────────────────────────────────────
// Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found." });

    const reviews = await Review.find({ roomId: room._id }).populate("userId", "first_name last_name");
    const avgRating =
      reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
        : null;

    res.json({ room, reviews, avgRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/rooms ─────────────────────────────────────────
// Admin only
export const createRoom = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.title && payload.description) {
      payload.title = payload.description.trim();
    }
    const room = await Room.create(payload);
    res.status(201).json({ room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── PUT /api/rooms/:id ──────────────────────────────────────
// Admin only
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found." });
    res.json({ room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── DELETE /api/rooms/:id ───────────────────────────────────
// Admin only
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found." });
    res.json({ message: "Room deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
