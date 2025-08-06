export function successResponse(
  res,
  data = undefined,
  msg = "Success",
  code = 200
) {
  return res.status(code).json({ success: true, message: msg, data });
}

export function errorResponse(res, errors, code = 500) {
  return res.status(code).json({ success: false, errors });
}
