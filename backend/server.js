import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import startScheduler from "./cron/scheduler.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import limiter from "./middleware/rateLimiter.js";

dotenv.config();

// =======================
// DATABASE
// =======================
connectDB();

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// GLOBAL MIDDLEWARES
// =======================

// Security headers
app.use(helmet());

// JSON parser
app.use(express.json());

// CORS (safe default)
app.use(
  cors({
    origin: "*", // 🔒 In production, restrict this
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Rate limiting (apply early)
app.use(limiter);

// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Start scheduler AFTER server starts
  startScheduler();
});
