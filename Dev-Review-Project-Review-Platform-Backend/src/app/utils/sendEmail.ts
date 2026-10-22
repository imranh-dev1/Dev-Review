import ejs from "ejs";
import path from "path";
import config from "../config";
import { transporter } from "../lib/nodemailer";

interface SendEmailOptions {
	to: string;
	subject: string;
	template: string;
	data?: Record<string, unknown>;
}

const sendEmail = async ({
	to,
	subject,
	template,
	data = {},
}: SendEmailOptions) => {
	try {
		const templatePath = path.join(
			process.cwd(),
			"src",
			"app",
			"templates",
			`${template}.ejs`,
		);

		const html = await ejs.renderFile(templatePath, {
			...data,
			year: new Date().getFullYear(),
		});

		const info = await transporter.sendMail({
			from: `"DevReview | Project Review Platform" < ${config.smtp_email_sender}> `,
			to,
			subject,
			html,
		});

		return info;
	} catch (error) {
		console.error("Email sending error:", error);
		throw error;
	}
};

export default sendEmail;
