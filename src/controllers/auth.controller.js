import "dotenv/config";
import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { sendVerificationEmail } from "../utils/email-service.js";
import generateToken from "../utils/generate-token.js";
import verifyToken from "../utils/verify-token.js";

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
    const activationToken = generateToken(user, "refresh");
    const activationLink = `${process.env.FRONTEND_URL}/verify-account/${activationToken}`;

    const updateToken = await User.findByIdAndUpdate(user._id, {
      verificationToken: activationToken,
    });

    // 4 - send email verification
    if (updateToken) {
      await sendVerificationEmail(email, name, activationLink);
    }

    return successResponse(
      res,
      undefined,
      "Register success, please check email to activate account",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export async function verifyAccount(req, res) {
  try {
    const { token } = req.params;

    // 1 - check token
    const user = await User.findOne({ verificationToken: token });
    if (!user) return errorResponse(res, "Token invalid", 400);

    try {
      verifyToken(token, "refresh");
    } catch (error) {
      return errorResponse(res, "Token expired", 400);
    }

    // 2 - activate user
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      verificationToken: null,
    });

    return successResponse(res, undefined, "Account has been verified");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    // 1 - check user
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, "User not found", 404);

    // 2 - compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResponse(res, "Wrong password", 400);

    // 3 - generate token, save token to db and client cookies
    const accessToken = generateToken(user, "access");
    const refreshToken = generateToken(user, "refresh");

    await User.findOneAndUpdate({ email }, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24hours
    });

    return successResponse(res, { token: accessToken }, "login successfull");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}
