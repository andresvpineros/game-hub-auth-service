export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class DuplicateResourceError extends AuthError {
  constructor(resource: string) {
    super(`${resource} already exists`, "DUPLICATE_RESOURCE");
    this.name = "DuplicateResourceError";
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}
