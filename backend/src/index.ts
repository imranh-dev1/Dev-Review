import "dotenv/config"
import express from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDatabase } from "./prisma/db";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { SubmissionRoutes } from "./app/modules/submission/submission.route";
import { AssignmentRoutes } from "./app/modules/review/review.route";
import { NotificationRoutes } from "./app/modules/notification/notification.route";
import { UserRoutes } from "./app/modules/user/user.route";
import { AuditRoutes } from "./app/modules/audit/audit.route";
import { AnalyticsRoutes } from "./app/modules/analytics/analytics.route";
import config from "./app/config";
import { redisClient } from "./app/lib/redis";
import { apiLimiter } from "./app/middlewares/rateLimiter";
import { errorHandler, notFound } from "./app/middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.frontend_url ? [config.frontend_url] : true,
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ meassage: "Server Is Runnig....." })
})

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DevReview API is running",
  });
});

const port = config.port;

await connectDatabase();

await redisClient.connect();
console.log("Connected to the Redis successfully.");

app.use("/api/v1", apiLimiter);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/submissions", SubmissionRoutes);
app.use("/api/v1/assignments", AssignmentRoutes);
app.use("/api/v1/notifications", NotificationRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/audit-logs", AuditRoutes);
app.use("/api/v1/analytics", AnalyticsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
})
