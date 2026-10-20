import dotenv from "dotenv";
import mongoose from "mongoose";
import Room from "../models/Room.js";

dotenv.config();

const rooms = [
  {
    title: "The Zamalek View",
    type: "Entire apartment",
    beds_num: 1,
    description: "Bright Zamalek apartment with a calm Nile view, modern furniture, and fast WiFi.",
    pricePerNight: 102,
    location: "Zamalek",
    city: "Cairo",
    discountRate: 15,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 65,
    services: "WiFi, AC, Kitchen, Parking, TV",
    maxGuests: 2
  },
  {
    title: "Blue Nile Studio",
    type: "Studio",
    beds_num: 1,
    description: "Cozy studio in Maadi with a quiet balcony and a fully equipped kitchen.",
    pricePerNight: 75,
    location: "Maadi",
    city: "Cairo",
    discountRate: 0,
    images: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522310503241-d0b3f2a5b7f7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 42,
    services: "WiFi, Kitchen, Balcony, TV",
    maxGuests: 2
  },
  {
    title: "Desert Pearl Suite",
    type: "Private room",
    beds_num: 2,
    description: "Private suite in New Cairo with gym access, breakfast, and premium bedding.",
    pricePerNight: 85,
    location: "New Cairo",
    city: "Cairo",
    discountRate: 10,
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522165065165-c8b646f65610?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505210895213-d4b53ce42fb0?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 90,
    services: "WiFi, Gym, Breakfast, Parking",
    maxGuests: 4
  },
  {
    title: "Corniche Loft",
    type: "Entire apartment",
    beds_num: 2,
    description: "Stylish loft in Alexandria overlooking the Corniche with sunset views.",
    pricePerNight: 120,
    location: "Corniche",
    city: "Alexandria",
    discountRate: 5,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522165065165-c8b646f65610?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1495368143681-40aa08e5a5ff?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 88,
    services: "WiFi, AC, Balcony, Kitchen, TV",
    maxGuests: 4
  },
  {
    title: "Historic Garden House",
    type: "Entire apartment",
    beds_num: 3,
    description: "Peaceful garden house near the Citadel, perfect for families and long stays.",
    pricePerNight: 140,
    location: "Old Cairo",
    city: "Cairo",
    discountRate: 8,
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1504672900777-996ffed296e3?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 120,
    services: "WiFi, AC, Parking, Kitchen, Washer",
    maxGuests: 6
  },
  {
    title: "Red Sea Breeze",
    type: "Hotel room",
    beds_num: 2,
    description: "Hurghada hotel room with sea view, pool access, and daily breakfast.",
    pricePerNight: 95,
    location: "Sahl Hasheesh",
    city: "Hurghada",
    discountRate: 12,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497957365055-bc96356babbe?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1470076386622-f97d7ddb2d26?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1517581291037-a67a04ddeebb?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 70,
    services: "WiFi, Pool, Breakfast, Parking",
    maxGuests: 3
  },
  {
    title: "Lighthouse Retreat",
    type: "Studio",
    beds_num: 1,
    description: "Minimalist studio near the Alexandria lighthouse with quiet nights.",
    pricePerNight: 62,
    location: "Anfushi",
    city: "Alexandria",
    discountRate: 0,
    images: [
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1504674900777-996ffed296e3?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 38,
    services: "WiFi, Kitchen, TV",
    maxGuests: 2
  },
  {
    title: "West Bank Oasis",
    type: "Entire apartment",
    beds_num: 2,
    description: "Luxor apartment with terrace views, great for explorers and families.",
    pricePerNight: 78,
    location: "West Bank",
    city: "Luxor",
    discountRate: 7,
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522165065165-c8b646f65610?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1495368143681-40aa08e5a5ff?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 80,
    services: "WiFi, AC, Kitchen, Parking",
    maxGuests: 4
  },
  {
    title: "Aswan Riverside Flat",
    type: "Entire apartment",
    beds_num: 2,
    description: "Calm riverside stay with a private balcony and fast WiFi.",
    pricePerNight: 88,
    location: "Corniche",
    city: "Aswan",
    discountRate: 6,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1495368143681-40aa08e5a5ff?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1504672900777-996ffed296e3?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 76,
    services: "WiFi, AC, Balcony, Kitchen",
    maxGuests: 4
  },
  {
    title: "Sharm Coral Escape",
    type: "Hotel room",
    beds_num: 1,
    description: "Modern hotel room in Sharm El Sheikh with beach access and pool.",
    pricePerNight: 110,
    location: "Naama Bay",
    city: "Sharm El Sheikh",
    discountRate: 9,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497957365055-bc96356babbe?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1504672900777-996ffed296e3?auto=format&fit=crop&w=1600&q=80"
    ],
    space: 64,
    services: "WiFi, Pool, Breakfast, AC",
    maxGuests: 2
  }
];

const connect = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI (or MONGO_URI) in environment.");
  }
  await mongoose.connect(mongoUri);
};

const run = async () => {
  const shouldReset = process.argv.includes("--reset");
  try {
    await connect();
    if (shouldReset) {
      await Room.deleteMany({});
      console.log("Cleared existing rooms.");
    }
    const created = await Room.insertMany(rooms);
    console.log(`Seeded ${created.length} rooms.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

run();
