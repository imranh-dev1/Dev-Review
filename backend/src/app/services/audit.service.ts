import { db } from "../../prisma/db";
import type { AuditAction, AuditEntityType } from "../types/models";

interface AuditEntry {
    actorId?: string | null;
    action: AuditAction;
    entityType: AuditEntityType;
    entityId?: string | null;
    metadata?: Record<string, unknown> | null;
}

export const recordAudit = async (entry: AuditEntry): Promise<void> => {
    try {
        await db.orm.public.AuditLog.create({
            actorId: entry.actorId ?? null,
            action: entry.action,
            entityType: entry.entityType,
            entityId: entry.entityId ?? null,
            metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        });
    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
};
