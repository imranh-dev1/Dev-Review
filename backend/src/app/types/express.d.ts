import type { AuthUser } from "./models";

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export {};
