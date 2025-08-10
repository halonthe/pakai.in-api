import express from "express";
import { authLimiter } from '../middlewares/rate-limiter.js'
import { validateInput } from "../middlewares/validate-input.js";
import { registerSchema, loginSchema } from "../schemas/user.schema.js";
import { register, verifyAccount, login } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  authLimiter,
  validateInput(registerSchema),
  register
);

authRouter.post("/verify-account/:token", authLimiter, verifyAccount);

authRouter.post(
  "/login",
  authLimiter,
  validateInput(loginSchema),
  login
);

export default authRouter;
