import express from "express";
import { register } from "../controllers/auth.controller.js";
import {validateInput} from "../middlewares/validate-input.js";
import { registerSchema } from "../schemas/user.schema.js";

const router = express.Router();

router.post("/api/auth/register", validateInput(registerSchema), register);

export default router;
