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

	jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

	redis_user: process.env.REDIS_USER!,
	redis_password: process.env.REDIS_PASSWORD!,
	redis_host: process.env.REDIS_HOST!,
	redis_port: process.env.REDIS_PORT!,

	smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	smtp_email_sender: process.env.SMTP_EMAIL_SENDER!,

	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	cloud_api_key: process.env.CLOUDINARY_API_KEY!,
	cloud_api_secret: process.env.CLOUDINARY_API_SECRET!,
};
