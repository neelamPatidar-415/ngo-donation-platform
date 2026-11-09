import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import {
  generalLimiter,
  authLimiter,
  aiLimiter,
} from "./middleware/rateLimitMiddleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/ai", aiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NGO Donation Platform API is running.",
  });
});

app.use("/api/schemes", schemeRoutes);
app.use("/api/eligibility", eligibilityRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/campaigns", campaignRoutes);

app.use("/api/receipts", receiptRoutes);

app.use("/api/donations", donationRoutes);

app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

app.use(errorMiddleware);

export default app;