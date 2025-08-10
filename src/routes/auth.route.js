import express from "express";
import passport from "../configs/passport.js";
import { authLimiter } from "../middlewares/rate-limiter.js";
import { validateInput } from "../middlewares/validate-input.js";
import { registerSchema, loginSchema } from "../schemas/user.schema.js";
import {
  register,
  verifyEmail,
  login,
  socialLoginSuccess,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// =================== CREDENTIALS ===================

authRouter.post("/register",authLimiter,validateInput(registerSchema),register);

authRouter.post("/login", authLimiter, validateInput(loginSchema), login);

authRouter.post("/verify-email", authLimiter, verifyEmail);

// =================== GOOGLE ===================

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/test" }),
  socialLoginSuccess
);

// =================== GITHUB ===================
// =================== FACEBOOK ===================
// =================== LINKEDIN ===================

export default authRouter;
