'use server';

import type { SignUpSchema } from '@/features/auth/schemas/signUpSchema';
import type { AuthResponse } from '@/features/auth/types/auth.types';
import { createClient } from '@/lib/supabase/server';

export async function signUp(data: SignUpSchema): Promise<AuthResponse> {
  const { email, password } = data;

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !authData.user) {
    return {
      user: null,
      session: null,
      error: error?.message || 'User creation failed: No user data returned.',
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
