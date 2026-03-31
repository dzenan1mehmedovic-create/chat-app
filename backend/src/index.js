import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend radi");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});
