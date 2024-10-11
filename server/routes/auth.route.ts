import express from "express";
import { register } from "../models/auth.model";

const router = express.Router();

router.post("/register", register);

export default router;
