import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import cors from "cors";
import config from "./app/config";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { UserRoutes } from "./app/modules/user/user.route";
import { SubmissionRoutes } from "./app/modules/submission/submission.route";
import { ReviewRoutes } from "./app/modules/review/review.route";
import { NotificationRoutes } from "./app/modules/notification/notification.route";
import { AnalyticsRoutes } from "./app/modules/analytics/analytics.route";
import { AuditRoutes } from "./app/modules/audit/audit.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		meassage: "Welcome to Project Review Platform Server is Running...",
	});
});

app.get("/api/v1/health", (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "DevReview API is running",
	});
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/submissions", SubmissionRoutes);
app.use("/api/v1/notifications", NotificationRoutes);
app.use("/api/v1/analytics", AnalyticsRoutes);
app.use("/api/v1/admin/audit-logs", AuditRoutes);
app.use("/api/v1", ReviewRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
