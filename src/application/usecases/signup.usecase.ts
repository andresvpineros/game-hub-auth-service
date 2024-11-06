import {
  DuplicateResourceError,
  ValidationError,
} from "@/domain/errors/auth.errors";
import { IAuthRepository } from "@/domain/interfaces/auth-repository.interface";
import {
  IAuthTokens,
  IUserRegistration,
} from "@/domain/interfaces/auth.interface";
import { ApiResponse } from "@/domain/interfaces/response.interface";

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(
    credentials: IUserRegistration
  ): Promise<ApiResponse<IAuthTokens>> {
    try {
      await this.authRepository.signup(credentials);
      return {
        success: true,
        message: "Signup successful!",
      };
    } catch (error) {
      if (error instanceof DuplicateResourceError) {
        return {
          success: false,
          error: {
            message: `${error.message}. Please choose different credentials.`,
            code: error.code,
          },
        };
      }

      if (error instanceof ValidationError) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        };
      }

      return {
        success: false,
        error: {
          message:
            "An unexpected error occurred during registration. Please try again.",
          code: "INTERNAL_ERROR",
        },
      };
    }
  }
}
