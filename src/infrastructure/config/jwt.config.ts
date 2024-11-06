import jwt from "jsonwebtoken";
import { config } from "./config";
export class JWTConfig {
  private static readonly JWT_SECRET = config.jwt.secret;
  private static readonly JWT_REFRESH_SECRET = config.jwt.refreshSecret;
  private static readonly ACCESS_TOKEN_EXPIRY = config.jwt.expiresIn;
  private static readonly REFRESH_TOKEN_EXPIRY = config.jwt.refreshExpiresIn;

  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  static verifyAccessToken(token: string): any {
    return jwt.verify(token, this.JWT_SECRET);
  }

  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.JWT_REFRESH_SECRET);
  }
}
