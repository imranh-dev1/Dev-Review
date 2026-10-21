import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";

interface ValidateSchemas {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export const validate = (schemas: ValidateSchemas): RequestHandler => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.params) {
                const parsedParams = await schemas.params.parseAsync(req.params);
                Object.defineProperty(req, "params", {
                    value: parsedParams,
                    writable: true,
                    configurable: true,
                    enumerable: true,
                });
            }
            if (schemas.query) {
                const parsedQuery = await schemas.query.parseAsync(req.query);
                Object.defineProperty(req, "query", {
                    value: parsedQuery,
                    writable: true,
                    configurable: true,
                    enumerable: true,
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
