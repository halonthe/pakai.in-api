import "dotenv/config";
import { successResponse, errorResponse } from "../utils/response.js";
import User from "../models/user.model.js";

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { name, email, avatar, address, phone } = user;

    const data = { name, email, avatar, address, phone };

    return successResponse(res, data, "Success getting user data");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}
