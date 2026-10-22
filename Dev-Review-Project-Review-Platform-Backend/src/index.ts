import app from "./app";
import config from "./app/config";
import { connectDatabase, db } from "./prisma/db";

const PORT = config.port;

const main = async () => {
	try {
		await connectDatabase();
		console.log("Connected to the database successfully.");

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);

		process.exit(1);
	}
};

main();
