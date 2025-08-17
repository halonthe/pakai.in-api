import { errorResponse } from "../utils/response.js";
import verifyToken from "../utils/verify-token.js";

export async function protectAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return errorResponse(res, "Token not provided", 401);

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return errorResponse(res, "Unauthorized", 401);

  req.user = decoded;
  next();
}
