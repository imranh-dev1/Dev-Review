import apiClint from "@/lib/apiClint";
import type { AuditAction, AuditEntityType } from "@/types";

export interface IAuditLogListQuery {
	page?: number;
	limit?: number;
	action?: AuditAction;
	entityType?: AuditEntityType;
	actorId?: string;
}

export const getAuditLogs = (query?: IAuditLogListQuery) => {
	return apiClint("/admin/audit-logs", {
		method: "GET",
		query,
	});
};
