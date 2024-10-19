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
    id,
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
        id: id,
        team_name: team_name,
        team_creator_id: team_creator, // Use the corrected field name
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

export const getCreatedTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  try {
    // Check if the team already exists
    const existingTeams = await prismaClient.team.findMany({
      where: { team_creator_id: userId },
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

export const getSingleTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const team_id = req.params.team_id;

  try {
    // Check if the team already exists
    const team_info = await prismaClient.team.findUnique({
      where: { id: team_id },
    });
    if (!team_info) {
      res.status(500).json("No team was associated with this id!");
      return; // Ensure it returns void
    }

    res.status(201).json(team_info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const deleteSingleTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const team_id = req.params.team_id;

  try {
    // Check if the team already exists
    const team_info = await prismaClient.team.findUnique({
      where: { id: team_id },
    });
    if (!team_info) {
      res.status(500).json("No team was associated with this id!");
      return; // Ensure it returns void
    }

    await prismaClient.team.delete({
      where: { id: team_id },
    });

    res.status(200).json({ message: "Team deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
