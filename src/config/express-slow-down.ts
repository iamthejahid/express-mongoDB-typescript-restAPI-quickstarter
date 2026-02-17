import { slowDown } from "express-slow-down";

const expressSlowDown = slowDown({
  windowMs: parseInt(process.env.WINDOW_BLOCK_SECOND || "30") * 1000,
  delayAfter: parseInt(process.env.PER_WINDOW_MAX_REQUEST || "30"),
  delayMs: () => 500,
});

export default expressSlowDown;
