'use server';

import type { SignInSchema } from '@/features/auth/schemas/signInSchema';
import type { AuthResponse } from '@/features/auth/types/auth.types';
import { createClient } from '@/lib/supabase/server';

export async function signIn(data: SignInSchema): Promise<AuthResponse> {
  const { email, password } = data;

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      user: null,
      session: null,
      error: error.message,
    };
  }

  return {
    user: {
      id: authData.user.id,
      email: authData.user.email,
    },
    session: authData.session
      ? {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
        }
      : null,
    error: null,
  };
}
