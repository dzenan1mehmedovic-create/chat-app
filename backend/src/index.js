import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB, db } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend radi");
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");
    res.status(200).json({
      message: "Baza radi",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška sa bazom",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server radi na portu ${PORT}`);
  await connectDB();
});
