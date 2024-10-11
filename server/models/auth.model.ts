import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  const inputErrors = validationResult(req);
  if (!inputErrors.isEmpty()) {
    res.status(400).json({ message: inputErrors.array() });
    return; // Ensure it returns void
  }

  const { username, email, password } = req.body;

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
        username,
        email,
        password: hashedPassword,
      },
    });

    // create a jwtToken
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );
    // console.log(token);

    // create a cookie called auth_token with jwtToken value
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, // in ms
    });

    res.status(200).json({ message: `User ${username} created successfully!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};
