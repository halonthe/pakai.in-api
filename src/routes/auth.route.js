import express from "express";
import 'dotenv/config'

import passport from "../configs/passport.js";
import { authLimiter } from "../middlewares/rate-limiter.js";
import { validateInput } from "../middlewares/validate-input.js";
import { protectAuth } from "../middlewares/protect-auth.js";
import { registerSchema, loginSchema, emailSchema, resetPasswordSchema } from "../schemas/user.schema.js";

import {
  register,
  verifyEmail,
  login,
  socialLoginSuccess,
  forgotPassword,
  resetPassword,
  getToken,
  logout,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// =================== CREDENTIALS ===================

authRouter.post("/register",authLimiter,validateInput(registerSchema),register);

authRouter.post("/login", authLimiter, validateInput(loginSchema), login);

authRouter.post('/logout', logout)

authRouter.post('/token/refresh', protectAuth, getToken)

authRouter.post("/verify-email", authLimiter, verifyEmail);

authRouter.post("/password/reset", authLimiter, validateInput(emailSchema), forgotPassword);

authRouter.patch("/password/reset", authLimiter, validateInput(resetPasswordSchema), resetPassword);

// =================== GOOGLE ===================

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  socialLoginSuccess
);

// =================== GITHUB ===================

authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email","read:user"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  socialLoginSuccess
);

// =================== FACEBOOK ===================

authRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ['email','public_profile'] })
);

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  socialLoginSuccess
);

// =================== TODO: LINKEDIN ===================

export default authRouter;
