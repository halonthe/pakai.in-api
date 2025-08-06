import { errorResponse } from "../utils/response.js";

export const validateInput = (schema) => async (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return errorResponse(res, result.error.issues, 400);

  req.body = result.data;
  next();
};
