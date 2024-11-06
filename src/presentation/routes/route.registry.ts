import { Router } from "express";
import { Request, Response } from "express";
import { ILogger } from "@/domain/interfaces/logger.interface";
import { BaseRoutes } from "./base.routes";

export class RouteRegistry {
  private readonly router: Router;
  private readonly routes: BaseRoutes[];

  constructor(private readonly logger: ILogger) {
    this.router = Router();
    this.routes = [];
  }

  public register(route: BaseRoutes): void {
    this.routes.push(route);
  }

  public init(): Router {
    this.routes.forEach((route) => {
      this.router.use("/", route.getRouter());
    });

    // 404 Handler
    this.router.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: "Not Found",
        error: {
          code: "ROUTE_NOT_FOUND",
          message: `The route ${req.originalUrl} was not found`,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    });

    return this.router;
  }
}
