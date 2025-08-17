import UserActivity from "../models/user-activity.model.js";
import { getClientDetails } from "../utils/get-client-details.js";

export default async function logActivity(req, res, next) {
  try {
    const { user, action, status, details } = req.activity;

    if (!user || !action || !status) {
      console.warn("⚠️ logActivity missing required fields");
      return next();
    }

    const client = await getClientDetails(req);

    await UserActivity.create({
      user,
      action,
      status,
      client,
      sessionData: {
        userAgent: req.headers["user-agent"],
      },
      details,
    });

    return next();
  } catch (error) {
    console.error("Error logging activity:", error);
    return next();
  }
}
