import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { z, ZodError } from "zod";
import apiResponse from "./response";

type typeValidationError = {
  [key: string]: string;
};

const uniqueCheck = async (isUnique: any) => {
  let validationError: typeValidationError = {};
  Object.keys(isUnique).forEach((key) => {
    validationError[key] = `"${isUnique[key]}" is already been taken.`;
  });
  return validationError;
};

const modelValidationCheck = async (errors: any) => {
  let validationError: typeValidationError = {};
  errors &&
    Object.keys(errors).forEach((key) => {
      validationError[errors[key].path] = errors[key].message;
    });
  return validationError;
};

const validateRequest =
  (schema: { body?: z.ZodObject<any>; query?: z.ZodObject<any>; params?: z.ZodObject<any> }) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (schema.body) req.body = await schema.body.parseAsync(req.body);
        if (schema.query) req.query = (await schema.query.parseAsync(req.query)) as any;
        if (schema.params) req.params = (await schema.params.parseAsync(req.params)) as any;
        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          const err: typeValidationError = {};
          error.issues.forEach((e) => {
            const path = e.path.join(".");
            err[path] = e.message;
          });
          return apiResponse(
            res,
            httpStatus.UNPROCESSABLE_ENTITY,
            { message: "Validation Error" },
            err
          );
        }
        return next(error);
      }
    };

export { uniqueCheck, modelValidationCheck, validateRequest };
