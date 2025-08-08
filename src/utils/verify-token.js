import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Verifies a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @param {string} type - The token type ('access', 'refresh', or custom).
 * @returns {object} - The decoded payload if valid.
 * @throws {Error} - If token is invalid or expired.
 */
export default function verifyToken(token, type = "access") {
  let secret;

  switch (type) {
    case "access":
      secret = process.env.JWT_ACCESS_SECRET;
      break;
    case "refresh":
      secret = process.env.JWT_REFRESH_SECRET;
      break;
    default:
      secret = type; // allow custom secret string
  }

  return jwt.verify(token, secret); // throws error if invalid/expired
}
