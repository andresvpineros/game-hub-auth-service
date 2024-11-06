import { IAuthRepository } from "@/domain/interfaces/auth-repository.interface";
import { LoginUseCase } from "../usecases/login.usecase";
import { ResetPasswordUseCase } from "../usecases/reset-password.usecase";
import { SignupUseCase } from "../usecases/signup.usecase";
import {
  IAuthCredentials,
  IPasswordReset,
  IUserRegistration,
} from "@/domain/interfaces/auth.interface";

export class AuthService {
  private loginUseCase: LoginUseCase;
  private signupUseCase: SignupUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;

  constructor(authRepository: IAuthRepository) {
    this.loginUseCase = new LoginUseCase(authRepository);
    this.signupUseCase = new SignupUseCase(authRepository);
    this.resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
  }

  async login(credentials: IAuthCredentials) {
    return this.loginUseCase.execute(credentials);
  }

  async signup(credentials: IUserRegistration) {
    return this.signupUseCase.execute(credentials);
  }

  async resetPassword(data: IPasswordReset) {
    return this.resetPasswordUseCase.execute(data);
  }
}
