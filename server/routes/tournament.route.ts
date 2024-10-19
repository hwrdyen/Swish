import express from "express";
import verifyToken from "../middleware/verifyToken";
import {
  createTournament,
  deleteSingleTournament,
  getSingleTournament,
  getTournaments,
} from "../models/tournament.model";

const router = express.Router();

router.post("/create-tour", verifyToken, createTournament);
router.get("/all", verifyToken, getTournaments);
router.get("/:tournament_id", verifyToken, getSingleTournament);
router.delete("/:tournament_id", verifyToken, deleteSingleTournament);

export default router;
