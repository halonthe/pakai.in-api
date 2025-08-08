import express from "express";
import { register } from "../controllers/auth.controller.js";
import { validateInput } from "../middlewares/validate-input.js";
import { registerSchema } from "../schemas/user.schema.js";

const authRouter = express.Router();

authRouter.post("/auth/register", validateInput(registerSchema), register);

export default authRouter;
