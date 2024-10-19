import express from "express";
import verifyToken from "../middleware/verifyToken";
import {
  createGame,
  deleteSingleGame,
  getAllGames,
  getSingleGame,
} from "../models/game.model";

const router = express.Router();

router.post("/create-game", verifyToken, createGame);
router.get("/all", verifyToken, getAllGames);
router.get("/:game_id", verifyToken, getSingleGame);
router.delete("/:game_id", verifyToken, deleteSingleGame);

export default router;
