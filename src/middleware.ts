import * as jwt from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { User } from "./entity/User";
import { JWT_SECRET } from "./env";
import { MyContext } from "./types";
import { IJwtEncode } from "./utils/jwt";

export const isUser: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const {
    req: {
      headers: { authorization },
    },
  } = context;

  if (!authorization) {
    throw Error("AUTH_ERROR");
  }

  try {
    const token = jwt.verify(authorization, JWT_SECRET) as IJwtEncode;
    const user = await User.findOneOrFail({
      where: { _id: token.id, isActive: true },
    });

    if (user) {
      context.user = user;
      return next();
    } else {
      throw Error("AUTH_ERROR");
    }
  } catch (err) {
    throw Error("AUTH_ERROR");
  }
};
