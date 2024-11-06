import {
  IAuthCredentials,
  IUserRegistration,
  IAuthTokens,
  IPasswordReset,
} from "./auth.interface";

export interface IAuthRepository {
  login(credentials: IAuthCredentials): Promise<IAuthTokens>;
  signup(userData: IUserRegistration): Promise<void>;
  resetPassword(data: IPasswordReset): Promise<void>;
  refreshToken(token: string): Promise<IAuthTokens>;
}
