import express from "express";
import verifyToken from "../middleware/verifyToken";
import multer from "multer";
import {
  deleteUser,
  getPersonalProfile,
  getUsers,
  postPersonalAvatar,
} from "../models/user.model";

const router = express.Router();

// telling multer we want to store any files/images we get from the API request in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post("/upload-avatar", upload.single("avatar"), postPersonalAvatar);
router.delete("/delete-me", verifyToken, deleteUser);
router.get("/me", verifyToken, getPersonalProfile);
router.get("/users", verifyToken, getUsers);

export default router;
