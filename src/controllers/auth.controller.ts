import argon2 from "argon2";
import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { ZodError } from "zod";
import UserRepository from "../repository/user.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwtUtils";
import {
  loginRequestSchema,
  signupRequestSchema,
  verifyQuerySchema,
} from "../schema/auth.schema";
import Mailer from "../utils/mailer";
import AppLogger from "../utils/logger";
import { verificationTemplate } from "../utils/templates/verification.template";
import { InvalidError } from "../types/errors";

const verificationStore: Record<string, string> = {};

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export default class AuthController {
  private readonly logger = AppLogger.getLogger();
  private readonly userRepo = new UserRepository();
  private readonly mailer = new Mailer();

  private issueTokenPair(userId: string) {
    const accessToken = generateAccessToken({ sub: userId, type: "access" });
    const refreshToken = generateRefreshToken({ sub: userId, type: "refresh" });
    return { accessToken, refreshToken };
  }

  private sendError(
    _req: Request,
    res: Response,
    err: unknown,
    methodName: string
  ): void {
    const requestId = res.locals.requestId || "n/a";

    if (err instanceof ZodError) {
      this.logger.warn(
        `[controller][auth] ${methodName} validation_failed requestId=${requestId}`
      );
      res.status(400).json({
        message: "Validation failed",
        errors: err.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      });
      return;
    }

    if (err instanceof InvalidError) {
      this.logger.warn(
        `[controller][auth] ${methodName} handled_error requestId=${requestId} message="${err.message}"`
      );
      res.status(400).json({ message: err.message });
      return;
    }

    if (err instanceof Error) {
      this.logger.error(
        `[controller][auth] ${methodName} unhandled_error requestId=${requestId} message="${err.message}"`
      );
      res.status(500).json({ message: err.message });
      return;
    }

    this.logger.error(
      `[controller][auth] ${methodName} unknown_error requestId=${requestId}`
    );
    res.status(500).json({ message: "Unknown error" });
  }

  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestId = res.locals.requestId || "n/a";
      this.logger.info(
        `[controller][auth] signup hit requestId=${requestId} path=${req.originalUrl}`
      );
      const parsed = signupRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        this.sendError(req, res, parsed.error, "signup");
        return;
      }

      const payload = parsed.data;
      this.logger.info(
        `[controller][auth] signup calling_repo=createUser requestId=${requestId} email=${payload.email}`
      );
      const user = await this.userRepo.createUser({
        username: payload.username,
        email: payload.email,
        passwordHash: payload.passwordHash,
        timezone: payload.timezone,
        locale: payload.locale,
      });
      this.logger.info(
        `[controller][auth] signup repo_success=createUser requestId=${requestId} userId=${user.userId}`
      );

      const token = randomUUID();
      verificationStore[user.userId] = token;
      const verificationUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/verify?userId=${encodeURIComponent(
        user.userId
      )}&token=${encodeURIComponent(token)}`;

      await this.mailer.sendMail({
        to: user.email,
        template: verificationTemplate({
          username: user.username,
          verificationUrl,
        }),
      });
      this.logger.info(
        `[controller][auth] signup mail_sent requestId=${requestId} userId=${user.userId}`
      );

      res.status(201).json({
        message: "Signup successful. Please verify your email.",
        user,
      });
      this.logger.info(
        `[controller][auth] signup response_sent requestId=${requestId} status=201`
      );
    } catch (err) {
      this.sendError(req, res, err, "signup");
    }
  };

  public verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestId = res.locals.requestId || "n/a";
      this.logger.info(
        `[controller][auth] verify hit requestId=${requestId} path=${req.originalUrl}`
      );
      const parsed = verifyQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        this.sendError(req, res, parsed.error, "verify");
        return;
      }

      const query = parsed.data;
      const expectedToken = verificationStore[query.userId];
      if (!expectedToken || expectedToken !== query.token) {
        throw new InvalidError("Invalid verification token");
      }

      delete verificationStore[query.userId];
      this.logger.info(
        `[controller][auth] verify calling_repo=verifyUserById requestId=${requestId} userId=${query.userId}`
      );
      const user = await this.userRepo.verifyUserById(query.userId);
      this.logger.info(
        `[controller][auth] verify repo_success=verifyUserById requestId=${requestId} userId=${query.userId}`
      );
      const { accessToken, refreshToken } = this.issueTokenPair(user.userId);

      res.cookie("accessToken", accessToken, cookieOptions());
      res.cookie("refreshToken", refreshToken, cookieOptions());
      res.status(200).json({
        message: "Email verified successfully.",
        user,
      });
      this.logger.info(
        `[controller][auth] verify response_sent requestId=${requestId} status=200 userId=${query.userId}`
      );
    } catch (err) {
      this.sendError(req, res, err, "verify");
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestId = res.locals.requestId || "n/a";
      this.logger.info(
        `[controller][auth] login hit requestId=${requestId} path=${req.originalUrl}`
      );
      const parsed = loginRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        this.sendError(req, res, parsed.error, "login");
        return;
      }

      const payload = parsed.data;
      this.logger.info(
        `[controller][auth] login calling_repo=getUserAuthByEmail requestId=${requestId} email=${payload.email}`
      );
      const user = await this.userRepo.getUserAuthByEmail(payload.email);
      if (!user) {
        throw new InvalidError("Invalid credentials");
      }
      if (!user.isVerified) {
        throw new InvalidError("User is not verified");
      }

      const isValidPassword = await argon2.verify(
        user.passwordHash,
        payload.password
      );
      if (!isValidPassword) {
        throw new InvalidError("Invalid credentials");
      }

      const { accessToken, refreshToken } = this.issueTokenPair(user.userId);
      res.cookie("accessToken", accessToken, cookieOptions());
      res.cookie("refreshToken", refreshToken, cookieOptions());
      res.status(200).json({ message: "Login successful" });
      this.logger.info(
        `[controller][auth] login response_sent requestId=${requestId} status=200 userId=${user.userId}`
      );
    } catch (err) {
      this.sendError(req, res, err, "login");
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestId = res.locals.requestId || "n/a";
      this.logger.info(
        `[controller][auth] refresh hit requestId=${requestId} path=${req.originalUrl}`
      );
      const token =
        typeof req.cookies?.refreshToken === "string"
          ? req.cookies.refreshToken
          : null;

      if (!token) {
        throw new InvalidError("Refresh token missing in cookies");
      }

      const decoded = verifyToken(token) as { sub?: string; type?: string };
      if (!decoded?.sub || decoded.type !== "refresh") {
        throw new InvalidError("Invalid refresh token");
      }

      this.logger.info(
        `[controller][auth] refresh calling_repo=getUserAuthById requestId=${requestId} userId=${decoded.sub}`
      );
      const user = await this.userRepo.getUserAuthById(decoded.sub);
      if (!user || !user.isVerified) {
        throw new InvalidError("Invalid refresh token");
      }

      const { accessToken, refreshToken } = this.issueTokenPair(user.userId);
      res.cookie("accessToken", accessToken, cookieOptions());
      res.cookie("refreshToken", refreshToken, cookieOptions());
      res.status(200).json({ message: "Token refresh successful" });
      this.logger.info(
        `[controller][auth] refresh response_sent requestId=${requestId} status=200 userId=${user.userId}`
      );
    } catch (err) {
      this.sendError(req, res, err, "refresh");
    }
  };
}
