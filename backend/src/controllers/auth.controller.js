import bcrypt from "bcryptjs";
import { db } from "../lib/db.js";
import { generateToken } from "../lib/utils.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Sva polja su obavezna" });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email već postoji" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [full_name, email, hashedPassword],
    );

    generateToken(result.insertId, res);

    res.status(201).json({
      id: result.insertId,
      full_name,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Ne postoji korisnik" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Pogrešan password" });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      profile_pic: user.profile_pic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout uspješan" });
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;

    const [users] = await db.query(
      "SELECT id, full_name, email, profile_pic FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
