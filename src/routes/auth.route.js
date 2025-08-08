import express from "express";
import { authLimiter } from '../middlewares/rate-limiter.js'
import { validateInput } from "../middlewares/validate-input.js";
import { registerSchema } from "../schemas/user.schema.js";
import { register } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/auth/register",
  authLimiter,
  validateInput(registerSchema),
  register
);

export default authRouter;
