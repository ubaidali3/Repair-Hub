
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import api from "./routes/api.js";

for (const key of ["MONGO_URI", "JWT_SECRET", "FRONTEND_URL"]) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key}`);
  }
}

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: "https://repair-hub-l2pc.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Authentication rate limiting
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
  })
);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "UstaadBid API running",
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// MongoDB connection reuse
let mongoPromise;

async function ensureMongo() {
  if (mongoose.connection.readyState === 1) return;

  if (!mongoPromise) {
    mongoPromise = mongoose
      .connect(process.env.MONGO_URI)
      .catch((err) => {
        mongoPromise = null;
        throw err;
      });
  }

  await mongoPromise;
}

// Connect database before API requests
app.use("/api", async (req, res, next) => {
  try {
    await ensureMongo();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err);

    res.status(503).json({
      error: "Database unavailable",
    });
  }
});

// API routes
app.use("/api", api);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.message);

  res.status(500).json({
    error: "Internal server error",
  });
});

// Local development
if (!process.env.VERCEL) {
  ensureMongo()
    .then(() => {
      app.listen(process.env.PORT || 4000, () => {
        console.log("UstaadBid API ready");
      });
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err);
      process.exit(1);
    });
}

// Vercel serverless export
export default app;
