import { successResponse, errorResponse } from "../utils/response.js";
import User from "../models/user.model.js";
import generateToken from "../utils/generate-token.js";
import { sendVerificationEmail } from "../utils/email-service.js";

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
    const user = await User.findByIdAndUpdate(req.user.id, req.body);
    if (!user) return errorResponse(res, "user not found", 404);

    return successResponse(res, undefined, "Profile updated");
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function updateEmail(req, res) {
  try {
    const { id, name } = req.user
    const {email} = req.body
    const user = await User.findByIdAndUpdate(id, {
      email,
      isVerified: false,
    });
    if (!user) return errorResponse(res, "user not found", 404);

    const activationToken = generateToken(user, "refresh");
    const activationLink = `${process.env.FRONTEND_URL}/verify-account/${activationToken}`;

    user.verificationToken = activationToken;
    await user.save();

    await sendVerificationEmail(email, name, activationLink);

    return successResponse(
      res,
      undefined,
      "Email changed, check your email to verify"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function updatePassword(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body);
    if (!user) return errorResponse(res, "user not found", 404);

    return successResponse(res, undefined, "Password changed");
  } catch (error) {
    return errorResponse(res, error);
  }
}
