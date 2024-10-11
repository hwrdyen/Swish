import express, { Request, Response } from "express";
import cors from "cors";
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.send("hello world!");
});

app.listen(8080, () => {
  console.log(`Server is running on ${PORT}`);
});
