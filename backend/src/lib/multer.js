import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const messagesPath = "uploads/messages";
const profilesPath = "uploads/profiles";

ensureDir(messagesPath);
ensureDir(profilesPath);

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Dozvoljene su samo slike"), false);
  }
};

const createStorage = (folder, prefix) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    },
  });

export const uploadMessageImage = multer({
  storage: createStorage(messagesPath, "message"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadProfileImage = multer({
  storage: createStorage(profilesPath, "profile"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
