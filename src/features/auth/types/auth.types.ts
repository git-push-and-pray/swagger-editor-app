export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthResponse =
  | {
      user: AuthUser;
      error: null;
    }
  | {
      user: null;
      error: string;
    };

export type SignOutResponse = { error: string | null };
