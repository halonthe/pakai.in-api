import express from "express";
import { authLimiter } from '../middlewares/rate-limiter.js'
import { validateInput } from "../middlewares/validate-input.js";
import { registerSchema } from "../schemas/user.schema.js";
import { register, verifyAccount } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  authLimiter,
  validateInput(registerSchema),
  register
);

authRouter.post("/verify-account/:token", authLimiter, verifyAccount);

export default authRouter;
