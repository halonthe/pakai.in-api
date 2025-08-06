import jwt from "jsonwebtoken";
import "dotenv/config";

export default function generateToken(type, user) {
  const payload = {
    id: user._id,
    email: user.email,
  };

  if (type === "access") {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
  } else {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });
  }
}
