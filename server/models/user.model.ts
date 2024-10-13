import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const getPersonalProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID missing in request" });
    return;
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, avatar: true }, // Select only the fields you want
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
