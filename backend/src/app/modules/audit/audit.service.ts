import httpStatus from "http-status";
import { db } from "../../../prisma/db";
import { AppError } from "../../utils/AppError";
import { buildMeta, getPagination } from "../../utils/pagination";
import type { AuditAction, AuditEntityType } from "../../types/models";

interface AuditListQuery {
    page?: number;
    limit?: number;
    action?: AuditAction;
    entityType?: AuditEntityType;
    actorId?: string;
}

const listAuditLogs = async (query: AuditListQuery) => {
    const { page, limit, skip, take } = getPagination(query);

    const filter = {
        ...(query.action ? { action: query.action } : {}),
        ...(query.entityType ? { entityType: query.entityType } : {}),
        ...(query.actorId ? { actorId: query.actorId } : {}),
    };

    const countResult = await db.orm.public.AuditLog
        .where(filter)
        .aggregate((a) => ({ count: a.count() }));

    const rows = await db.orm.public.AuditLog
        .where(filter)
        .orderBy((l) => l.createdAt.desc())
        .limit(take)
        .offset(skip)
        .include("actor", (a) => a.select("id", "name", "email"))
        .all();

    return { rows, meta: buildMeta(page, limit, countResult.count) };
};

const getAuditLogDetail = async (id: string) => {
    const log = await db.orm.public.AuditLog
        .where({ id })
        .include("actor", (a) => a.select("id", "name", "email"))
        .first();

    if (!log) {
        throw new AppError(httpStatus.NOT_FOUND, "Audit log not found");
    }

    return log;
};

export const AuditServices = {
    listAuditLogs,
    getAuditLogDetail,
};
