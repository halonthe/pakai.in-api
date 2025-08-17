import { successResponse, errorResponse } from "../utils/response.js";
import User from "../models/user.model.js";

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { name, email, avatar, address, phone } = user;

    const data = { name, email, avatar, address, phone };

    return successResponse(res, data, "Success getting user data");
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function updateProfile(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!user) return errorResponse(res, "user not found", 404);

    return successResponse(res, undefined, "Profile updated");
  } catch (error) {
    return errorResponse(res, error);
  }
}

// TODO: update email
// TODO: update password