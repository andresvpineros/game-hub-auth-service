import { RequestHandler } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
} from "../schemas/validation.schemas";
import { BaseRoutes } from "./base.routes";
import { ILogger } from "@/domain/interfaces/logger.interface";
import { AuthRepository } from "@/infrastructure/repositories/auth.repository";
import { AuthService } from "@/application/services/auth.service";

export class AuthRoutes extends BaseRoutes {
  private readonly authController: AuthController;

  constructor(logger: ILogger) {
    super(logger, "v1", "/auth");

    // Dependencies
    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);
    this.authController = new AuthController(authService);

    this.init();
  }

  protected initializeRoutes(): void {
    this.router.post(
      this.getFullPath("/login"),
      validate(loginSchema) as RequestHandler,
      (req, res) => void this.authController.login(req, res)
    );

    this.router.post(
      this.getFullPath("/signup"),
      validate(signupSchema) as RequestHandler,
      (req, res) => void this.authController.signup(req, res)
    );

    this.router.post(
      this.getFullPath("/reset-password"),
      validate(resetPasswordSchema) as RequestHandler,
      (req, res) => void this.authController.resetPassword(req, res)
    );

    this.router.get(
      this.getFullPath("/me"),
      authenticateToken as RequestHandler,
      (req, res) => {
        res.json({ user: req.body.user });
      }
    );

    this.logger.info(`Auth routes initialized at ${this.getFullPath("")}`);
  }
}
