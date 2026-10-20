import "dotenv/config"
import express from "express"
import { connectDatabase } from "./prisma/db";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import config from "./app/config";
import { redisClient } from "./app/lib/redis";

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({ meassage: "Server Is Runnig....." })
})

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DevReview API is running",
  });
});

const port = config.port;

await connectDatabase();

await redisClient.connect();
console.log("Connected to the Redis successfully.");

app.use("/api/v1/auth", AuthRoutes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
})
