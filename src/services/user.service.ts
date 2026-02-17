import { Request } from "express";
import { UserModel } from "@main/models/user.model";
import jwt from "jsonwebtoken";

const getUserInfoByToken = async (req: Request) => {
  const accessToken: any = req.headers["authorization"]?.split(" ")[1];
  const decoded: any = jwt.decode(accessToken, { complete: true });

  const user = await UserModel.findOne({ _id: decoded?.payload.user?._id });

  if (user) return user;

  return null;
};

export { getUserInfoByToken };
