import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { AuditControllers } from "./audit.controller";
import { auditIdParamsSchema, listAuditLogsQuerySchema } from "./audit.validation";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", validate({ query: listAuditLogsQuerySchema }), AuditControllers.listAuditLogs);

router.get("/:id", validate({ params: auditIdParamsSchema }), AuditControllers.getAuditLogDetail);

export const AuditRoutes = router;
