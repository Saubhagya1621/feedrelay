import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";
import pickupRouter from "./routes/pickup.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/pickups", pickupRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "FeedRelay API is live" });
});

app.use(errorHandler);

export { app };
