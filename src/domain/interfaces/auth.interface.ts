export interface IAuthCredentials {
  identifier: string;
  password: string;
}

export interface IUserRegistration {
  email: string;
  password: string;
  username: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IPasswordReset {
  email: string;
}
