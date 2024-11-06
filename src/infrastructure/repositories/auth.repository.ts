import { IAuthRepository } from "@/domain/interfaces/auth-repository.interface";
import {
  IAuthCredentials,
  IUserRegistration,
  IAuthTokens,
  IPasswordReset,
} from "@/domain/interfaces/auth.interface";
import { supabase } from "../config/supabase.config";
import { JWTConfig } from "../config/jwt.config";
import { DuplicateResourceError } from "@/domain/errors/auth.errors";

export class AuthRepository implements IAuthRepository {
  async login(credentials: IAuthCredentials): Promise<IAuthTokens> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.identifier);
    let authResponse;

    if (isEmail) {
      authResponse = await supabase.auth.signInWithPassword({
        email: credentials.identifier,
        password: credentials.password,
      });
    } else {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email, username")
        .eq("username", credentials.identifier)
        .single();

      if (userError || !userData) throw new Error("User not found");

      authResponse = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: credentials.password,
      });
    }

    if (authResponse.error) throw authResponse.error;

    const accessToken = JWTConfig.generateAccessToken({
      userId: authResponse.data.user?.id,
      email: authResponse.data.user?.email,
    });

    const refreshToken = JWTConfig.generateRefreshToken({
      userId: authResponse.data.user?.id,
      email: authResponse.data.user?.email,
    });

    return { accessToken, refreshToken };
  }

  async signup(userData: IUserRegistration): Promise<void> {
    // Validation
    const { data: existingUsers, error } = await supabase
      .from("users")
      .select("email, username")
      .or(`email.eq."${userData.email}",username.eq."${userData.username}"`)
      .limit(2);

    console.log("Existing users check:", existingUsers, error);

    if (error) {
      throw new Error("Database validation failed");
    }

    if (existingUsers && existingUsers.length > 0) {
      const emailExists = existingUsers.some(
        (user) => user.email === userData.email
      );
      const usernameExists = existingUsers.some(
        (user) => user.username === userData.username
      );

      if (emailExists && usernameExists) {
        throw new DuplicateResourceError("Email and username");
      } else if (emailExists) {
        throw new DuplicateResourceError("Email");
      } else if (usernameExists) {
        throw new DuplicateResourceError("Username");
      }
    }

    // Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
        },
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Insert into users table
    const { error: userError } = await supabase.from("users").insert([
      {
        email: userData.email,
        username: userData.username,
        password: userData.password,
      },
    ]);

    if (userError) {
      // If user table insert fails, we should clean up the auth user
      // Implement rollback mechanism
      await this.rollbackAuthUser(authData.user?.id);
      throw new Error("Failed to create user profile");
    }
  }

  private async rollbackAuthUser(userId?: string): Promise<void> {
    if (userId) {
      // Implement cleanup logic for failed signups
      // This could involve deleting the auth user or marking them as invalid
      // Depending on your requirements
    }
  }

  async resetPassword(data: IPasswordReset): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email);
    if (error) throw error;
  }

  async refreshToken(token: string): Promise<IAuthTokens> {
    const decoded = JWTConfig.verifyRefreshToken(token);

    const accessToken = JWTConfig.generateAccessToken({
      userId: decoded.userId,
    });
    const refreshToken = JWTConfig.generateRefreshToken({
      userId: decoded.userId,
    });

    return { accessToken, refreshToken };
  }
}
