import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp", // Placeholder avatar
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github", "facebook"],
      default: "credentials",
    },
    providerId: {
      type: String, // ID from OAuth provider (Google/GitHub)
      default: null,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    phone: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false, // hide from the query (for security reason).
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.providerId && this.provider !== "credentials") {
    this.isVerified = true;
  }

  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Instance method to link social account
userSchema.methods.linkSocialAccount = async function (provider, providerId) {
  this.provider = provider;
  this.providerId = providerId;
  return this.save();
};

// Prevent model overwrite in dev mode
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
