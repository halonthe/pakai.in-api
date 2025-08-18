import express from "express";
import "dotenv/config";
import { getProfile, updateEmail, updatePassword, updateProfile } from "../controllers/user.controller.js";
import { protectAuth } from "../middlewares/protect-auth.js";
import { protectVerified } from "../middlewares/protect-verified.js";
import { validateInput } from "../middlewares/validate-input.js";
import { resetPasswordSchema, updateProfileSchema } from "../schemas/user.schema.js";

const userRouter = express.Router();

userRouter.get("/me", protectAuth, getProfile);
userRouter.patch('/me',protectAuth, protectVerified, validateInput(updateProfileSchema), updateProfile)
userRouter.patch('/email',protectAuth, protectVerified, validateInput(updateProfileSchema), updateEmail)
userRouter.patch('/password',protectAuth, protectVerified, validateInput(resetPasswordSchema), updatePassword)

export default userRouter;
