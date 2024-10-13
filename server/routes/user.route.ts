import express from "express";
import verifyToken from "../middleware/verifyToken";
import { getPersonalProfile } from "../models/user.model";

const router = express.Router();

router.get("/me", verifyToken, getPersonalProfile);

export default router;
