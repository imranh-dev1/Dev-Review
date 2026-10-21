import httpStatus from "http-status";
import { or } from "@prisma/orm-postgres/orm-client";
import bcrypt from "bcrypt";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import config from "../../config";
import { recordAudit } from "../../services/audit.service";
import { AppError } from "../../utils/AppError";
import { asVarchar } from "../../utils/casts";
import { buildMeta, getPagination } from "../../utils/pagination";
import type { AuthUser, UserRole, UserStatus } from "../../types/models";

interface UserListQuery {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
}

const USER_PUBLIC_FIELDS = [
    "id",
    "name",
    "email",
    "avatar",
    "role",
    "status",
    "emailVerifiedAt",
    "createdAt",
    "updatedAt",
] as const;

const escapeLike = (value: string): string => value.replace(/[\\%_]/g, "\\$&");

const listUsers = async (query: UserListQuery) => {
    const { page, limit, skip, take } = getPagination(query);

    let base = db.orm.public.User.where({
        ...(query.role ? { role: query.role } : {}),
        ...(query.status ? { status: query.status } : {}),
    });

    if (query.search) {
        const term = escapeLike(query.search);
        base = base.where((u) => or(u.name.ilike(`%${term}%`), u.email.ilike(`%${term}%`)));
    }

    const countResult = await base.aggregate((a) => ({ count: a.count() }));

    const rows = await base
        .orderBy([(u) => u.createdAt.desc(), (u) => u.id.desc()])
        .limit(take)
        .offset(skip)
        .select(...USER_PUBLIC_FIELDS)
        .all();

    return { rows, meta: buildMeta(page, limit, countResult.count) };
};

const getUserDetail = async (id: string) => {
    const user = await db.orm.public.User
        .where({ id })
        .select(...USER_PUBLIC_FIELDS)
        .first();

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const [submissionCountResult, reviewCountResult] = await Promise.all([
        db.orm.public.ProjectSubmission
            .where({ ownerId: id, deletedAt: null })
            .aggregate((a) => ({ count: a.count() })),
        db.orm.public.Review
            .where({ reviewerId: id })
            .aggregate((a) => ({ count: a.count() })),
    ]);

    return {
        ...user,
        counts: {
            submissions: submissionCountResult.count,
            reviews: reviewCountResult.count,
        },
    };
};

const updateUserStatus = async (id: string, actor: AuthUser, status: UserStatus) => {
    const user = await db.orm.public.User.where({ id }).select("id", "name", "status").first();

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.id === actor.id && status !== "ACTIVE") {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change your own account status");
    }

    if (user.status === status) {
        return { id: user.id, status };
    }

    await db.orm.public.User.where({ id }).update({ status });

    await recordAudit({
        actorId: actor.id,
        action: "USER_STATUS_CHANGE",
        entityType: "USER",
        entityId: id,
        metadata: { from: user.status, to: status, name: user.name },
    });

    return { id: user.id, status };
};

const updateUserRole = async (id: string, actor: AuthUser, role: UserRole) => {
    const user = await db.orm.public.User.where({ id }).select("id", "name", "role").first();

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.id === actor.id) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change your own role");
    }

    if (user.role === role) {
        return { id: user.id, role };
    }

    await db.orm.public.User.where({ id }).update({ role });

    await recordAudit({
        actorId: actor.id,
        action: "ROLE_CHANGE",
        entityType: "USER",
        entityId: id,
        metadata: { from: user.role, to: role, name: user.name },
    });

    return { id: user.id, role };
};

const createUser = async (actor: AuthUser, payload: { name: string; email: string; password: string; role: UserRole }) => {
    const email = payload.email.trim().toLowerCase();

    const existing = await db.orm.public.User.first({ email: asVarchar<255>(email) });
    if (existing) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));

    const user = await db.orm.public.User.create({
        name: asVarchar<100>(payload.name),
        email: asVarchar<255>(email),
        passwordHash: hashedPassword,
        role: payload.role,
        emailVerifiedAt: Temporal.Now.instant(),
    });

    await recordAudit({
        actorId: actor.id,
        action: "CREATE",
        entityType: "USER",
        entityId: user.id,
        metadata: { email, role: payload.role, createdBy: "admin" },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export const UserServices = {
    listUsers,
    getUserDetail,
    updateUserStatus,
    updateUserRole,
    createUser,
};
