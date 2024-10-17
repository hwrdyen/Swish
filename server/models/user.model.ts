import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cloudinary from "cloudinary";

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

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prismaClient.user.findMany({
      select: { id: true, email: true, username: true, avatar: true },
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

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Delete the user
    await prismaClient.user.delete({
      where: { id: userId },
    });

    // Send success response
    res
      .cookie("auth_token", "", {
        expires: new Date(0),
      })
      .status(200)
      .json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to upload image to Cloudinary
async function uploadProfileImage(
  avatarFile: Express.Multer.File
): Promise<string> {
  // Encode the image as a Base-64 string
  const b64 = Buffer.from(avatarFile.buffer).toString("base64");
  // Create a string that describes the image
  const dataURI = `data:${avatarFile.mimetype};base64,${b64}`;

  try {
    // Upload the image to Cloudinary using the Cloudinary SDK
    const res = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "/swish/avatar-img", // Specify the folder name
    });
    // Return the URL if the upload is successful
    return res.url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload avatar image.");
  }
}

// Controller for handling avatar upload
export const postPersonalAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }
    const profileAvatarUrl = await uploadProfileImage(file);

    res.status(201).json({ avatarUrl: profileAvatarUrl });
  } catch (error) {
    // TypeScript recognizes 'error' as 'unknown', so we must narrow its type
    if (error instanceof Error) {
      // Handle the error if it is an instance of Error
      console.error("Error in postPersonalAvatar:", error.message);
      res.status(500).json({ message: error.message });
    } else {
      // If 'error' is of an unexpected type, return a generic message
      console.error("Unexpected error in postPersonalAvatar:", error);
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};
