import express from "express";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  markMessagesAsSeen,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadMessageImage } from "../lib/multer.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.put("/seen/:id", protectRoute, markMessagesAsSeen);
router.post(
  "/send/:id",
  protectRoute,
  uploadMessageImage.single("image"),
  sendMessage,
);

export default router;
