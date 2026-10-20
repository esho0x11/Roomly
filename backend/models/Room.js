import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    type:          { type: String, required: true },       // e.g. Apartment, Studio
    beds_num:      { type: Number, required: true },
    description:   { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    location:      { type: String, required: true },
    city:          { type: String, required: true },
    discountRate:  { type: Number, default: 0 },           // percentage, e.g. 15
    images:        { type: [String], default: [] },        // array of image URLs
    space:         { type: Number },                       // m²
    services:      { type: String },                       // e.g. "WiFi, AC, Parking"
    maxGuests:     { type: Number, required: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
