import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadProfileImage } from "../lib/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);
router.put(
  "/update-profile",
  protectRoute,
  uploadProfileImage.single("profile_pic"),
  updateProfile,
);

export default router;
