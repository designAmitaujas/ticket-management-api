import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env";

export interface IJwtEncode {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  id: string;
}

export const signJwt = (arg0: IJwtEncode): string => {
  return jwt.sign(arg0, JWT_SECRET, { expiresIn: "7d" });
};
