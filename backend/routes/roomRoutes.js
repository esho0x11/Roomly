import { Router } from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/",    getAllRooms);
router.get("/:id", getRoomById);

router.post("/",    protect, adminOnly, createRoom);
router.put("/:id",  protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
