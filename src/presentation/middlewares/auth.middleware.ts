import { NextFunction, Request, Response } from "express";
import { JWTConfig } from "@/infrastructure/config/jwt.config";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = JWTConfig.verifyAccessToken(token);
    req.body.user = decoded; // TODO: Validate req.user
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};
