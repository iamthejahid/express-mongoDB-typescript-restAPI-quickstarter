import { rateLimit } from "express-rate-limit";

const expressRateLimit = rateLimit({
  windowMs: parseInt(process.env.WINDOW_BLOCK_SECOND || "30") * 1000,
  max: parseInt(process.env.PER_WINDOW_MAX_REQUEST || "30"),
  message: `You have exceeded the ${process.env.PER_WINDOW_MAX_REQUEST} requests in ${process.env.WINDOW_BLOCK_SECOND} seconds limit!`,
});

export default expressRateLimit;
