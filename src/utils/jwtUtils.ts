import jwt from "jsonwebtoken";
import AppLogger from "./logger";
import { InvalidError, EnvironmentError } from "../types/errors";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRY_REFRESH =
  process.env.JWT_REFRESH_EXPIRY || "";
const JWT_EXPIRY_ACCESS =
  process.env.JWT_ACCESS_EXPIRY ||  "";

if (!JWT_SECRET || !JWT_EXPIRY_ACCESS || !JWT_EXPIRY_REFRESH) {
  throw new EnvironmentError("JWT_SECRET or JWT_EXPIRY is empty or null");
}
const logger = AppLogger.getLogger();

export function generateRefreshToken(payload: object): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY_REFRESH as jwt.SignOptions["expiresIn"],
    });
    logger.info(`[jwt] Successfully generated token!`);
    return token;
  } catch (err) {
    logger.error(`[jwt]Error generating token: ${err}`);
    throw new InvalidError("Failed to generate token.");
  }
}

export function generateAccessToken(payload: object): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY_ACCESS as jwt.SignOptions["expiresIn"],
    });
    logger.info(`[jwt] Successfully generated token!`);
    return token;
  } catch (err) {
    logger.error(`[jwt]Error generating token: ${err}`);
    throw new InvalidError("Failed to generate token.");
  }
}

export function verifyToken(token: string): object {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as object;
    logger.info(`[jwt] Successfully validated token.`);
    return payload;
  } catch (err) {
    logger.error(`[jwt] Error validating token: ${err}`);
    throw new InvalidError("Failed to validate token.");
  }
}
