import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["SIGNIN", "SIGNUP", "SIGNOUT", "EMAIL_VERIFICATION", 'TOKEN_REQUEST'],
    },
    deviceInfo: {
      browser: {
        name: String,
        version: String,
      },
      os: {
        name: String,
        version: String,
      },
      device: {
        type: String, // mobile, tablet, desktop
        brand: String,
        model: String,
      },
    },
    location: {
      ip: String,
      city: String,
      country: String,
      timezone: String,
    },
    sessionData: {
      userAgent: String,
      timestamp: {
        type: Date,
        default: Date.now(),
      },
      duration: Number, // in second
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      required: true,
    },
    details: String,
  },
  { timestamps: true }
);

userActivitySchema.index({ user: 1, "sessionData.timestamp": -1 });
userActivitySchema.index({ "deviceInfo.device.type": 1 });
userActivitySchema.index({ action: 1 });

// Prevent model overwrite in dev mode
const UserActivity =
  mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);
export default UserActivity;
