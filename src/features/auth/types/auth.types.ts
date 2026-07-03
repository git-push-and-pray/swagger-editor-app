export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
};

export type AuthSuccessResponse = {
  user: AuthUser;
  session: AuthSession | null;
  error: null;
};

export type AuthErrorResponse = {
  user: null;
  session: null;
  error: string;
};

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export type SignOutSuccessResponse = {
  user: null;
  session: null;
  error: null;
};

export type SignOutErrorResponse = {
  user: null;
  session: null;
  error: string;
};

export type SignOutResponse = SignOutSuccessResponse | SignOutErrorResponse;
