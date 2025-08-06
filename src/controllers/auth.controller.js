import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import generateToken from "../utils/generate-token.js";

export async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    // 1 - check user
    const userExist = await User.findOne({ email });
    if (userExist) return errorResponse(res, "User already exist", 409);

    // 2 - create user
    const user = await User.create({
      name,
      email,
      password,
    });

    return successResponse(
      res,
      user,
      "Register success, please check email to activate account",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
}
