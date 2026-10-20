import "dotenv/config"
import express from "express"
import { connectDatabase } from "./prisma/db";

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

const port = 3000;

await connectDatabase();

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
})
