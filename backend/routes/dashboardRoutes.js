import express from "express";
import {
  getStats,
  getUpcomingPosts
} from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getStats);
router.get("/upcoming", authMiddleware, getUpcomingPosts);

export default router;
