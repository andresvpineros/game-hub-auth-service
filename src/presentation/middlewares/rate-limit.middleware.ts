import { ILogger } from "@/domain/interfaces/logger.interface";
import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export class RateLimitMiddleware {
  constructor(private readonly logger: ILogger) {}

  public handle() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again in 15 minutes",
      handler: (req: Request, res: Response) => {
        this.logger.warn(`Too many requests from ${req.ip}`);
        res.status(429).json({
          message:
            "Too many requests from this IP, please try again in 15 minutes",
        });
      },
    });
  }
}
