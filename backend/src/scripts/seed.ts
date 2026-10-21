import bcrypt from "bcrypt";
import { Temporal } from "temporal-polyfill";
import config from "../app/config";
import { asVarchar } from "../app/utils/casts";
import { connectDatabase, db } from "../prisma/db";

const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@devreview.local")
    .trim()
    .toLowerCase();
const adminName = process.env.ADMIN_NAME ?? "DevReview Admin";
const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";

const seed = async () => {
    await connectDatabase();

    const existing = await db.orm.public.User.first({
        email: asVarchar<255>(adminEmail),
    });

    if (existing) {
        if (existing.role !== "ADMIN" || existing.status !== "ACTIVE") {
            await db.orm.public.User.where({ id: existing.id }).update({
                role: "ADMIN",
                status: "ACTIVE",
            });
            console.log(`Updated "${adminEmail}" to ACTIVE ADMIN.`);
        } else {
            console.log(`Admin user "${adminEmail}" already exists.`);
        }
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
        adminPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await db.orm.public.User.create({
        name: asVarchar<100>(adminName),
        email: asVarchar<255>(adminEmail),
        passwordHash: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerifiedAt: Temporal.Now.instant(),
    });

    console.log(`Created admin user "${adminEmail}".`);
    process.exit(0);
};

seed().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});
