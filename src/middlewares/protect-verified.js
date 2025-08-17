import User from "../models/user.model.js";
import { errorResponse } from "../utils/response.js";

export async function protectVerified(req, res, next) {
  const isVerified = await User.findById(req.user.id)
  if (!isVerified)
    return errorResponse(
      res,
      "Email not verified, please verify your email first",
      400
    );

  next();
}
