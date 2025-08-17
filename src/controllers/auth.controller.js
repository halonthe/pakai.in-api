import "dotenv/config";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/email-service.js";
import generateToken from "../utils/generate-token.js";
import User from "../models/user.model.js";
import verifyToken from "../utils/verify-token.js";
import logActivity from "../middlewares/log-activity.js";

export async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    // 1 - check user
    const userExist = await User.findOne({ email });
    if (userExist) {
      req.activity = {
        user: userExist._id,
        action: "SIGNUP",
        status: "FAILED",
        details: "User already exist",
      };
      return logActivity(req, res, () =>
        errorResponse(res, "User already exist", 409)
      );
    }

    // 2 - create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3 - create token and link activation
    const activationToken = generateToken(user, "refresh");
    const activationLink = `${process.env.FRONTEND_URL}/verify-account/${activationToken}`;

    user.verificationToken = activationToken;
    await user.save();

    // 4 - send email verification
    await sendVerificationEmail(email, name, activationLink);

    // 5 - log activity
    req.activity = {
      user: user._id,
      action: "SIGNUP",
      status: "SUCCESS",
      details: "User registered",
    };
    logActivity(req, res, () => {});

    return successResponse(
      res,
      undefined,
      "Register success, please check email to activate account",
      201
    );
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    // 1 - check token
    const user = await User.findOne({ verificationToken: token });
    if (!user) return errorResponse(res, "Token invalid", 400);

    try {
      await verifyToken(token, "refresh");
    } catch (error) {
      req.activity = {
        user: user._id,
        action: "EMAIL_VERIFICATION",
        status: "FAILED",
        details: "Token expired",
      };
      return logActivity(req, res, () =>
        errorResponse(res, "Token expired", 400)
      );
    }

    // 2 - activate user
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // 3 - log activity
    req.activity = {
      user: user._id,
      action: "EMAIL_VERIFICATION",
      status: "SUCCESS",
      details: "Account has been verified",
    };
    logActivity(req, res, () => {});

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

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: 24 * 60 * 60 * 1000, // 24hours
    });

    // 4 - log activity
    req.activity = {
      user: user._id,
      action: "SIGNIN",
      status: "SUCCESS",
      details: "logined",
    };
    logActivity(req, res, () => {});

    return successResponse(res, { token: accessToken }, "login successfull");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export async function socialLoginSuccess(req, res) {
  try {
    const refreshToken = generateToken(req.user, "refresh");

    await User.findByIdAndUpdate(req.user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: 24 * 60 * 60 * 1000, // 24hours
    });

    req.activity = {
      user: req.user._id,
      action: "SIGNUP",
      status: "SUCCESS",
      details: "User registered",
    };
    logActivity(req, res, () => {});

    return res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, "user not found", 404);

    const resetToken = generateToken(user, "access"); // expired: 1 hour
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    user.resetPasswordToken = resetToken;
    await user.save();

    await sendResetPasswordEmail(email, user.name, resetUrl);

    req.activity = {
      user: user._id,
      action: "RESET_PASSWORD",
      status: "SUCCESS",
      details: "Request reset password",
    };
    logActivity(req, res, () => {});

    return successResponse(
      res,
      undefined,
      `Password reset link sent to ${email}`
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export async function resetPassword(req, res) {
  try {
    const { password } = req.body;
    const { token } = req.query;

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) return errorResponse(res, "Token invalid", 400);

    try {
      await verifyToken(token, "access");
    } catch (error) {
      req.activity = {
        user: user._id,
        action: "RESET_PASSWORD",
        status: "FAILED",
        details: "token expired",
      };
      logActivity(req, res, () => {});
      return errorResponse(res, "Token expired", 400);
    }

    user.password = password;
    user.resetPasswordToken = null;
    await user.save();

    req.activity = {
      user: user._id,
      action: "RESET_PASSWORD",
      status: "SUCCESS",
      details: "password updated",
    };
    logActivity(req, res, () => {});
    return successResponse(res, undefined, "Password has been updated");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export async function getToken(req, res) {
  try {
    const { token } = req.cookies;
    if (!token) return errorResponse(res, "Token not provided", 401);

    try {
      await verifyToken(token, "refresh");
    } catch (error) {
      req.activity = {
        user: req.user._id,
        action: "TOKEN_REQUEST",
        status: "FAILED",
        details: "refresh token expired",
      };
      logActivity(req, res, () => {});
      return errorResponse(res, "Unauthorized", 401);
    }

    const accessToken = generateToken(req.user, "access");

    req.activity = {
      user: req.user._id,
      action: "TOKEN_REQUEST",
      status: "SUCCESS",
      details: "token refreshed",
    };
    logActivity(req, res, () => {});

    return successResponse(res, { token: accessToken }, "Token refreshed");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export async function logout(req, res) {
  try {
    const { token } = req.cookies;
    const user = await User.findOne({ refreshToken: token });
    if (!token || !user) return errorResponse(res, undefined, 204);

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken");

    req.activity = {
      user: user._id,
      action: "SIGNOUT",
      status: "SUCCESS",
      details: "logged out",
    };
    logActivity(req, res, () => {});

    return successResponse(res, undefined, "Logged out");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}
