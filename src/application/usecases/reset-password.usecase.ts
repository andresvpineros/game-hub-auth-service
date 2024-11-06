import { IAuthRepository } from "@/domain/interfaces/auth-repository.interface";
import { IPasswordReset } from "@/domain/interfaces/auth.interface";
import { ApiResponse } from "@/domain/interfaces/response.interface";

export class ResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: IPasswordReset): Promise<ApiResponse<void>> {
    try {
      await this.authRepository.resetPassword(data);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Reset password failed!",
          code: "RESET_PASSWORD_FAILED",
        },
      };
    }
  }
}
