import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, db } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  console.log("Korisnik povezan:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[String(userId)] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ receiverId, senderName }) => {
    const receiverSocketId = getReceiverSocketId(String(receiverId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("showTyping", {
        senderId: String(userId),
        senderName,
      });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(String(receiverId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("hideTyping", {
        senderId: String(userId),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Korisnik diskonektovan:", socket.id);

    if (userId) {
      delete userSocketMap[String(userId)];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, async () => {
  console.log(`Server radi na portu ${PORT}`);
  await connectDB();
});
