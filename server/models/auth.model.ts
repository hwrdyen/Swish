import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

// TODO: Add Avatar submission through cloudinary
export const register = async (req: Request, res: Response): Promise<void> => {
  const inputErrors = validationResult(req);
  if (!inputErrors.isEmpty()) {
    res.status(400).json({ message: inputErrors.array() });
    return; // Ensure it returns void
  }

  const { id, username, email, password, avatar } = req.body;
  try {
    // Error -- User already Exists
    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return; // Ensure it returns void
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create newUser
    const newUser = await prismaClient.user.create({
      data: {
        id,
        username,
        email,
        password: hashedPassword,
        avatar,
      },
    });

    res.status(200).json({ message: `User ${username} created successfully!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // check if the user exists
    const userFound = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!userFound) {
      res.status(401).json({ message: "Invalid Credentials!" });
      return;
    }

    // check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Credentials!" });
      return;
    }

    // create a jwtToken
    const token = jwt.sign(
      { userId: userFound.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    const { password: userFoundPassword, ...userFoundInfo } = userFound; // return userFoundInfo, but leave out password

    // create a cookie called auth_token with jwtToken value
    res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // in ms
      })
      .status(200)
      .json(userFoundInfo);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to login!" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res
    .cookie("auth_token", "", {
      expires: new Date(0),
    })
    .status(200)
    .json({ message: "Logout successfully!" });
};
