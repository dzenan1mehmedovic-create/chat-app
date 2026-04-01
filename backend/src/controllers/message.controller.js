import { db } from "../lib/db.js";
import { io, getReceiverSocketId } from "../index.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.userId;

    const [users] = await db.query(
      `SELECT id, full_name, email, profile_pic
       FROM users
       WHERE id != ?
       ORDER BY full_name ASC`,
      [loggedInUserId],
    );

    res.status(200).json(users);
  } catch (error) {
    console.log("Greška u getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Greška na serveru" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.userId;
    const { id: userToChatId } = req.params;

    const [messages] = await db.query(
      `SELECT id, sender_id, receiver_id, text, image, created_at
       FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [myId, userToChatId, userToChatId, myId],
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("Greška u getMessages:", error.message);
    res.status(500).json({ message: "Greška na serveru" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { id: receiverId } = req.params;
    const text = req.body.text || "";

    let image = "";

    if (req.file) {
      image = `/uploads/messages/${req.file.filename}`;
    }

    if (!text.trim() && !image) {
      return res.status(400).json({ message: "Poruka ili slika su obavezni" });
    }

    const [result] = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, text, image)
       VALUES (?, ?, ?, ?)`,
      [senderId, receiverId, text, image],
    );

    const [newMessageRows] = await db.query(
      `SELECT id, sender_id, receiver_id, text, image, created_at
       FROM messages
       WHERE id = ?`,
      [result.insertId],
    );

    const newMessage = newMessageRows[0];

    const receiverSocketId = getReceiverSocketId(String(receiverId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Greška u sendMessage:", error.message);
    res.status(500).json({ message: "Greška na serveru" });
  }
};
