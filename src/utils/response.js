export function successResponse(
  res,
  data = undefined,
  msg = "Success",
  code = 200
) {
  return res.status(code).json({ success: true, message: msg, data });
}

export function errorResponse(
  res,
  errors,
  msg = "Internal Server Error",
  code = 500
) {
  return res.status(code).json({ success: true, msg, errors });
}
