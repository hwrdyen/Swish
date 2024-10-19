import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { check, validationResult } from "express-validator";

const prismaClient = new PrismaClient();

export const createGame = async (req: Request, res: Response) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      res.status(400).json({ message: inputErrors.array() });
      return; // Ensure it returns void
    }

    const {
      id,
      game_date,
      home_team_score,
      away_team_score,
      home_team_id,
      away_team_id,
      tournament_id,
    } = req.body;

    // Create the new team
    const newGame = await prismaClient.game.create({
      data: {
        id: id,
        game_date: game_date,
        home_team_score: home_team_score,
        away_team_score: away_team_score,
        home_team_id: home_team_id,
        away_team_id: away_team_id,
        tournament_id: tournament_id,
      },
    });

    res.status(201).json({ message: `New Game is created successfully!` });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to create new game!" });
  }
};

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const existingTeams = await prismaClient.game.findMany();
    res.status(201).json(existingTeams);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to fetch any game!" });
  }
};

export const getSingleGame = async (req: Request, res: Response) => {
  const game_id = req.params.game_id;
  try {
    const game_info = await prismaClient.game.findUnique({
      where: { id: game_id },
    });
    if (!game_info) {
      res.status(500).json("No game was associated with this id!");
      return; // Ensure it returns void
    }

    res.status(201).json(game_info);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: `Failed to fetch game ${game_id}!` });
  }
};

export const deleteSingleGame = async (req: Request, res: Response) => {
  const game_id = req.params.game_id;
  try {
    const game_info = await prismaClient.game.findUnique({
      where: { id: game_id },
    });
    if (!game_info) {
      res.status(500).json("No game was associated with this id!");
      return; // Ensure it returns void
    }

    await prismaClient.game.delete({
      where: { id: game_id },
    });

    res.status(200).json({ message: "Game deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: `Failed to fetch game ${game_id}!` });
  }
};
