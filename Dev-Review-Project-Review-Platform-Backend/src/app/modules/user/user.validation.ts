import z from "zod";

const updateProfileSchema = z
	.object({
		name: z.string().trim().min(2).max(100).optional(),
		avatar: z.url().max(2048).optional(),
	})
	.refine((data) => data.name !== undefined || data.avatar !== undefined, {
		message: "At least one field (name or avatar) is required",
	});

export const UserProfileValidation = {
	updateProfileSchema,
};
