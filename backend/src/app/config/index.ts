import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bak_url: process.env.APP_URL,
    frontend_url: process.env.FRONTEND_URL,

    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

    redis_user: process.env.REDIS_USER!,
    redis_password: process.env.REDIS_PASSWORD!,
    redis_host: process.env.REDIS_HOST!,
    redis_port: process.env.REDIS_PORT!,

    smtp_user: process.env.SMTP_USER!,
    smtp_password: process.env.SMTP_PASSWORD!,
    smtp_email_sender: process.env.SMTP_EMAIL_SENDER!,
}