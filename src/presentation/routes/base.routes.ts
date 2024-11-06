import { ILogger } from "@/domain/interfaces/logger.interface";
import { Router } from "express";

export abstract class BaseRoutes {
  protected router: Router;
  protected version: string;
  protected basePath: string;

  constructor(
    protected readonly logger: ILogger,
    version: string = "v1",
    basePath: string = "/api"
  ) {
    this.router = Router();
    this.version = version;
    this.basePath = basePath;
  }

  public init(): Router {
    this.initializeRoutes();
    return this.router;
  }

  protected abstract initializeRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }

  protected getFullPath(path: string): string {
    return `/${this.version}${this.basePath}${path}`;
  }
}
