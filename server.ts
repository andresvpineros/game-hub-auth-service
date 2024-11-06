import express from "express";
import cors from "cors";
import helmet from "helmet";

import { WinstonLogger } from "@/infrastructure/logging/winston-logger";
import { ErrorMiddleware } from "@/presentation/middlewares/error.middleware";
import { config } from "@/infrastructure/config/config";
import { RouteRegistry } from "@/presentation/routes/route.registry";
import { RateLimitMiddleware } from "@/presentation/middlewares/rate-limit.middleware";
import { AuthRoutes } from "@/presentation/routes/auth.routes";

async function main() {
  const app = await express();

  // Dependencies
  const logger = new WinstonLogger();

  // Middleware
  const rateLimitMiddleware = new RateLimitMiddleware(logger);
  const errorMiddleware = new ErrorMiddleware(logger);

  // Global Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(rateLimitMiddleware.handle());
  app.use(errorMiddleware.handle.bind(errorMiddleware));

  // Routes
  const routeRegistry = new RouteRegistry(logger);

  routeRegistry.register(new AuthRoutes(logger));

  app.use(routeRegistry.init());

  // Start server
  const port = config.port;
  app.listen(port, () => {
    logger.info(
      `Auth Service is running on port ${port} in ${config.nodeEnv} mode`
    );
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
