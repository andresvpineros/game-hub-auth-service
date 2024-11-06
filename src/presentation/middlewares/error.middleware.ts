import { ILogger } from "@/domain/interfaces/logger.interface";
import { Response, Request, NextFunction } from "express";

export class ErrorMiddleware {
  constructor(private readonly logger: ILogger) {}

  handle(err: Error, req: Request, res: Response, next: NextFunction) {
    this.logger.error("Error ocurred", { error: err });

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
}
