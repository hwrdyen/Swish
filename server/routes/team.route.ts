import express from "express";
import verifyToken from "../middleware/verifyToken";
import {
  createTeam,
  getSingleTeam,
  getCreatedTeams,
  deleteSingleTeam,
} from "../models/team.model";

const router = express.Router();

router.post("/created-teams", verifyToken, createTeam);
router.get("/created-teams", verifyToken, getCreatedTeams);
router.get("/:team_id", verifyToken, getSingleTeam);
// router.get("/:player_id", verifyToken, getSingleTeam);
router.delete("/:team_id", verifyToken, deleteSingleTeam);

export default router;
