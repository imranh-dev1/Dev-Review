export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
    take: number;
}

export const getPagination = (query: { page?: unknown; limit?: unknown }): PaginationParams => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    return {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
    };
};

export const buildMeta = (page: number, limit: number, total: number) => ({
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
});
