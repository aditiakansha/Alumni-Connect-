import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import alumniRoutes from "./routes/alumni.routes";
import jobsRoutes from "./routes/jobs.routes";
import referralsRoutes from "./routes/referrals.routes";
import forumRoutes from "./routes/forum.routes";
import eventsRoutes from "./routes/events.routes";
import adminRoutes from "./routes/admin.routes";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (for example health checks) without an Origin header.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
}));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/referrals", referralsRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/admin", adminRoutes);
