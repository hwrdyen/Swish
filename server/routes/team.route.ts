import express from "express";
import verifyToken from "../middleware/verifyToken";
import { createTeam, getTeams } from "../models/team.model";

const router = express.Router();

router.post("/", verifyToken, createTeam);
router.get("/", verifyToken, getTeams);

export default router;
