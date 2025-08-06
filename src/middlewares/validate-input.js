import { errorResponse } from "../utils/response.js";

export const validateInput = (schema) => async (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success)
    errorResponse(res, result.error.errors, "Validation Error", 400);

  req.body = result.data;
  next();
};
