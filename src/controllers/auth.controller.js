import "dotenv/config";
import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import generateToken from "../utils/generate-token.js";
import { sendVerificationEmail } from "../utils/email-service.js";

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

    // 3 - create token and link activation
    const activationToken = generateToken("access", user);
    const expiredToken = Date.now() + 60 * 60 * 1000;
    const activationLink = `${process.env.FRONTEND_URL}/verify-account/${activationToken}`;

    const updateToken = await User.findByIdAndUpdate(user._id, {
      verificationToken: activationToken,
      verificationTokenExpired: expiredToken,
    });

    // 4 - send email verification
    if (updateToken) {
      sendVerificationEmail(email, name, activationLink);
    }

    return successResponse(
      res,
      null,
      "Register success, please check email to activate account",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
}
