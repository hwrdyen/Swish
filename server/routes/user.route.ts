import express from "express";
import verifyToken from "../middleware/verifyToken";
import { getPersonalProfile, getUsers } from "../models/user.model";

const router = express.Router();

router.get("/me", verifyToken, getPersonalProfile);
router.get("/users", verifyToken, getUsers);

export default router;
