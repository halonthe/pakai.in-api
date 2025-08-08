import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5, // Limit each IP to 5 requests per 5 minutes
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    success: false,
    message: "Too many request, please try again after 5 minutes.",
  },
});
