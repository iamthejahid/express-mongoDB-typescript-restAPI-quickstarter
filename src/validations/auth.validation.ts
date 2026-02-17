import { z } from "zod";
import { validateRequest } from "@main/utils/validationError";

const register = {
  body: z.object({
    name: z.string().min(6).max(255),
    email: z.string().email().min(6).max(255),
    password: z.string().min(6).max(255),
  }),
};

const login = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

const renew = {
  body: z.object({
    access: z.string().min(1),
    refresh: z.string().min(1),
  }),
};

const registerValidation = validateRequest(register);
const loginValidation = validateRequest(login);
const renewValidation = validateRequest(renew);
export { registerValidation, loginValidation, renewValidation };
