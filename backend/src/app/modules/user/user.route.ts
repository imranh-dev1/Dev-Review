import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { UserControllers } from "./user.controller";
import {
    createUserSchema,
    listUsersQuerySchema,
    updateUserRoleSchema,
    updateUserStatusSchema,
    userIdParamsSchema,
} from "./user.validation";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", validate({ query: listUsersQuerySchema }), UserControllers.listUsers);

router.post("/", validate({ body: createUserSchema }), UserControllers.createUser);

router.get("/:id", validate({ params: userIdParamsSchema }), UserControllers.getUserDetail);

router.patch(
    "/:id/status",
    validate({ params: userIdParamsSchema, body: updateUserStatusSchema }),
    UserControllers.updateUserStatus,
);

router.patch(
    "/:id/role",
    validate({ params: userIdParamsSchema, body: updateUserRoleSchema }),
    UserControllers.updateUserRole,
);

export const UserRoutes = router;
