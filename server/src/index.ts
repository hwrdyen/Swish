import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Pool } from "pg";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// import routes
import authRoute from "../routes/auth.route";
import userRoute from "../routes/user.route";
import teamRoute from "../routes/team.route";
import gameRoute from "../routes/game.route";
import tourRoute from "../routes/tournament.route";

const PORT = process.env.PORT || 5000;
const connectionString = process.env.DATABASE_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true, // SSL validation
    ca: process.env.TEMBO_CA, // CA certificate
  },
});
pool
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the process with a failure code
  });

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    // our server is only going to accept request from FRONTEND_URL url
    // and that URL must include credentials/HTTP cookie in the request
  })
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/team", teamRoute);
app.use("/api/game", gameRoute);
app.use("/api/tour", tourRoute);

app.get("/", async (req: Request, res: Response) => {
  res.send("hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
