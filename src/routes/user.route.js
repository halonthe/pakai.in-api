import express from "express";
import "dotenv/config";
import { getProfile } from "../controllers/user.controller.js";
import { protectAuth } from "../middlewares/protect-auth.js";

const userRouter = express.Router();

userRouter.get("/me", protectAuth, getProfile);

export default userRouter;
