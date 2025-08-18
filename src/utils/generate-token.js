import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Generate a JWT token.
 *
 * @param {object} user - The user data for payload.
 * @param {string} type - The token type ('access' or 'refresh').
 * @param {string} expires - The expires token ('1s','1h','2d' or etc) -- default: JWT_ACCESS_EXPIRES in env.
 * @returns {string} - The token if success.
 * @throws {Error} - If payload or secret is invalid.
 */
export default function generateToken(
  user,
  type = "access",
  expires = process.env.JWT_ACCESS_EXPIRES
) {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  let secret;
  let expire;

  switch (type) {
    case "access":
      secret = process.env.JWT_ACCESS_SECRET;
      expire = process.env.JWT_ACCESS_EXPIRES;
      break;
    case "refresh":
      secret = process.env.JWT_REFRESH_SECRET;
      expire = process.env.JWT_REFRESH_EXPIRES;
      break;
    default:
      secret = type; // allow custom secret string
      expire = expires;
  }

  return jwt.sign(payload, secret, { expiresIn: expire });
}
