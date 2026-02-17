import { ObjectId } from "mongoose";
import passportJwt from "passport-jwt";
import { UserModel } from "@main/models/user.model";

const passportJwtInit = new passportJwt.Strategy(
  {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: (process.env.JWT_ACCESS_SECRET as string) || "fallback",
  },
  async (jwt_payload: any, done: (err: any, user?: any, info?: any) => void) => {
    if (jwt_payload && jwt_payload.user && jwt_payload.user._id) {
      const accessUser = await UserModel.findOne(
        { _id: jwt_payload.user._id },
        { name: true, email: true }
      );
      if (!accessUser) return done({ message: "Invalid Token" }, null);

      const currentDate = new Date();
      if (currentDate > new Date(jwt_payload.exp))
        return done({ message: "Expired Token" }, null);

      return done(null, jwt_payload);
    } else return done({ message: "Invalid Token" }, null);
  }
);

export default passportJwtInit;
