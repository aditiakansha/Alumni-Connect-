import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";

// Extend Express's Request type so `req.user` is typed everywhere downstream.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Verifies the Bearer token and attaches the decoded payload to req.user.
// Every protected route sits behind this.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or malformed Authorization header" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
