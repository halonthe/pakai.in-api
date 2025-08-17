import express from "express";
import "dotenv/config";
import { getProfile } from "../controllers/user.controller.js";

const userRouter = express.Router()

userRouter.get('/me', getProfile)

export default userRouter