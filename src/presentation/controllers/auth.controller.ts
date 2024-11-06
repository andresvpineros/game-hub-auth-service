import { Request, Response } from "express";
import { AuthService } from "@/application/services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const result = await this.authService.login(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  }

  async signup(req: Request, res: Response) {
    const result = await this.authService.signup(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  }

  async resetPassword(req: Request, res: Response) {
    const result = await this.authService.resetPassword(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  }
}
