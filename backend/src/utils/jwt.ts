import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccountRole = "SELLER" | "CLIENT";

export interface AuthTokenPayload {
  id: string;
  role: AccountRole;
}

export const signAuthToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

export const verifyAuthToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
