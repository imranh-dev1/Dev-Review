import { db } from "../../prisma/db";
import type { AuditAction, AuditEntityType } from "../types/models";
import { buildMeta, getPagination } from "../utils/pagination";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

interface AuditEntry {
	actorId?: string | null;
	action: AuditAction;
	entityType: AuditEntityType;
	entityId?: string | null;
	metadata?: Record<string, unknown> | null;
	ipAddress?: string | null;
}

const buildData = (entry: AuditEntry) => ({
	actorId: entry.actorId ?? null,
	action: entry.action,
	entityType: entry.entityType,
	entityId: entry.entityId ?? null,
	metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
	ipAddress: entry.ipAddress ?? null,
});

export const createAuditLog = async (entry: AuditEntry) => {
	return db.orm.public.AuditLog.create(buildData(entry));
};

export const createAuditLogInTx = async (tx: Tx, entry: AuditEntry) => {
	return tx.orm.public.AuditLog.create(buildData(entry));
};

interface AuditLogQuery {
	page?: number;
	limit?: number;
	action?: AuditAction;
	entityType?: AuditEntityType;
	actorId?: string;
}

const listAuditLogs = async (query: AuditLogQuery) => {
	const { page, limit, skip, take } = getPagination(query);

	const logs = db.orm.public.AuditLog.where({
		...(query.action ? { action: query.action } : {}),
		...(query.entityType ? { entityType: query.entityType } : {}),
		...(query.actorId ? { actorId: query.actorId } : {}),
	});

	const { count } = await logs.aggregate((a) => ({ count: a.count() }));

	const data = await logs
		.orderBy([(log) => log.createdAt.desc(), (log) => log.id.desc()])
		.limit(take)
		.offset(skip)
		.include("actor", (actor) => actor.select("id", "name", "email", "role"))
		.all();

	return {
		data,
		meta: buildMeta(page, limit, count),
	};
};

export const AuditServices = {
	createAuditLog,
	createAuditLogInTx,
	listAuditLogs,
};
