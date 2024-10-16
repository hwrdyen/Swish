import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
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

// async function uploadProfileImage(imageFiles: Express.Multer.File[]) {
//   const uploadPromises = imageFiles.map(async (image) => {
//     // we encode the image as a Base-64 string
//     const b64 = Buffer.from(image.buffer).toString("base64");
//     // we create a string that describes the image
//     let dataURI = "data:" + image.mimetype + ";base64," + b64;
//     // using the cloudinary SDK to upload this image to our cloudinary account
//     const res = await cloudinary.v2.uploader.upload(dataURI);
//     // if its success, then it'll return the URL
//     // (if we have five images, then all images will be uploaded at the same time
//     // and before we get the image URL back)
//     return res.url;
//   });
// }

// export const postPersonalAvatar = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const file = req.files as Express.Multer.File[];
//   const profileAvatarUrl = await uploadProfileImage(file);
//   res.status(201).json(profileAvatarUrl);
// };
