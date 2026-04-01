import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Nema tokena" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Neispravan token" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Greška u protectRoute:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
