import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { check, validationResult } from "express-validator";

const prismaClient = new PrismaClient();

export const createTournament = async (req: Request, res: Response) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      res.status(400).json({ message: inputErrors.array() });
      return; // Ensure it returns void
    }

    const { id, tournament_name, tournament_avatar, team_list, game_list } =
      req.body;

    const newTournament = prismaClient.tournament.create({
      data: { id, tournament_name, tournament_avatar, team_list, game_list },
    });

    res
      .status(201)
      .json({ message: `New Tournament is created successfully!` });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to create new tournament!" });
  }
};

export const getTournaments = async (req: Request, res: Response) => {
  try {
    const inputErrors = validationResult(req);
    if (!inputErrors.isEmpty()) {
      res.status(400).json({ message: inputErrors.array() });
      return; // Ensure it returns void
    }

    const existingTournaments = prismaClient.tournament.findMany();

    res.status(201).json(existingTournaments);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to fetch any tournament!" });
  }
};

export const getSingleTournament = async (req: Request, res: Response) => {
  const tournament_id = req.params.tournament_id;
  try {
    const tournament_info = await prismaClient.tournament.findUnique({
      where: { id: tournament_id },
    });
    if (!tournament_info) {
      res.status(500).json("No tournament was associated with this id!");
      return; // Ensure it returns void
    }

    res.status(201).json(tournament_info);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: `Failed to fetch tournament ${tournament_id}!` });
  }
};

export const deleteSingleTournament = async (req: Request, res: Response) => {
  const tournament_id = req.params.tournament_id;
  try {
    const tournament_info = await prismaClient.tournament.findUnique({
      where: { id: tournament_id },
    });
    if (!tournament_info) {
      res.status(500).json("No tournament was associated with this id!");
      return; // Ensure it returns void
    }

    await prismaClient.tournament.delete({
      where: { id: tournament_id },
    });

    res.status(200).json({ message: "Tournament deleted successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: `Failed to fetch tournament ${tournament_id}!` });
  }
};
