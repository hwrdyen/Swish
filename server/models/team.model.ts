import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const inputErrors = validationResult(req);
  if (!inputErrors.isEmpty()) {
    res.status(400).json({ message: inputErrors.array() });
    return; // Ensure it returns void
  }

  const {
    team_name,
    team_creator,
    coach_list = [],
    player_list = [],
  } = req.body;

  try {
    // Check if the team already exists
    const existingTeams = await prismaClient.team.findMany({
      where: { team_name: team_name },
    });

    if (existingTeams.length > 0) {
      res.status(400).json({ message: "Team already exists" });
      return; // Ensure it returns void
    }

    // Create the new team
    const newTeam = await prismaClient.team.create({
      data: {
        team_name: team_name,
        team_creator: team_creator, // Use the corrected field name
        coach_list: coach_list, // Defaults to empty array if not provided
        player_list: player_list, // Defaults to empty array if not provided
      },
    });

    res
      .status(201)
      .json({ message: `Team ${newTeam.team_name} created successfully!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create team!" });
  }
};

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    // Check if the team already exists
    const existingTeams = await prismaClient.team.findMany({
      where: { team_creator: userId },
    });

    if (existingTeams.length > 0) {
      res.status(200).json(existingTeams);
      return; // Ensure it returns void
    }

    res.status(201).json({ message: `No team was created by this user` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load team!" });
  }
};
