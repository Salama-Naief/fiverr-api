import rateLimiter from "express-rate-limit";
export const limit = () => {
  rateLimiter({
    windowMs: 20 * 1000,
    max: 60,
  });
};
