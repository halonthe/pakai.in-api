import express from "express";
import "dotenv/config";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { protectAuth } from "../middlewares/protect-auth.js";
import { protectVerified } from "../middlewares/protect-verified.js";
import { validateInput } from "../middlewares/validate-input.js";
import { updateProfileSchema } from "../schemas/user.schema.js";

const userRouter = express.Router();

userRouter.get("/me", protectAuth, getProfile);
userRouter.patch('/:id',protectAuth, protectVerified, validateInput(updateProfileSchema), updateProfile)

export default userRouter;
