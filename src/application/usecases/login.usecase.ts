import { IAuthRepository } from "@/domain/interfaces/auth-repository.interface";
import {
  IAuthCredentials,
  IAuthTokens,
} from "@/domain/interfaces/auth.interface";
import { ApiResponse } from "@/domain/interfaces/response.interface";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(
    credentials: IAuthCredentials
  ): Promise<ApiResponse<IAuthTokens>> {
    try {
      const tokens = await this.authRepository.login(credentials);
      return {
        success: true,
        message: "Login successful!",
        data: tokens,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Login failed!",
          code: "LOGIN_FAILED",
        },
      };
    }
  }
}
