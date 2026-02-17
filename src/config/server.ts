import "dotenv/config";
// Import Routes
import authRoute from "@main/routes/auth.route";
import userRoute from "@main/routes/user.route";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morganBody from "morgan-body";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../../swagger.json" with { type: "json" };
import { corsSetup } from "./cors";
import expressRateLimit from "./express-rate";
import expressSlowDown from "./express-slow-down";
import dbConnect from "./mongoose";
import { expressDevLogger } from "./morgan";
import passportHttpInit from "./passport-http";
import passportJwtInit from "./passport-jwt";
import apiResponse from "@main/utils/response";
import logger from "@main/config/logger";

export const createServer = async () => {
  const server = express();

  server.use(express.json()); // Json parse
  server.use(corsSetup); // Cors set
  server.use(helmet()); // secure express apps by setting various HTTP headers

  morganBody(server);
  server.use(expressDevLogger); // custom logger

  server.use(passport.initialize()); // passport authentication initialize
  passport.use("basic", passportHttpInit); // passport http authentication initialize
  passport.use("jwt", passportJwtInit); // passport jwt authentication initialize

  const indexRouter = express.Router();
  indexRouter.get("/", [], async (req: Request, res: Response) => {
    return res.status(200).send("Express MongoDB Typescript Boilerplate");
  });

  // Router Connections
  server.use(indexRouter);
  server.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile)); // Swagger Routing
  server.use("/api/auth", authRoute);
  server.use("/api/user", userRoute);

  if (process.env.NODE_ENVIRONMENT === "production") {
    server.use(expressRateLimit); // per window rate limit
    server.use(expressSlowDown); // slow down rather then block
  }

  // Error Handler
  server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    return apiResponse(res, err.status || 500, { message: err.message || "Internal Server Error" }, err);
  });

  await dbConnect(); // Mongo DB Connection

  return server;
};
