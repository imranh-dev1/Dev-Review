import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "../../types/models";
import { AuditControllers } from "./audit.controller";
import { listAuditLogsQuerySchema } from "./audit.validation";

const router = Router();

router.get(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(listAuditLogsQuerySchema),
	AuditControllers.listAuditLogs,
);

export const AuditRoutes = router;
