import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import api from "./routes/api.js";
for (const key of ["MONGO_URI", "JWT_SECRET", "FRONTEND_URL"])
  if (!process.env[key]) throw new Error(`Missing ${key}`);
const app = express();
app.use(helmet());

app.use(cors({
  origin: "https://repair-hub-45zn-zaruu.vercel.app/",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", api);
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});
await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT || 4000, () => console.log("UstaadBid API ready"));
