'use server';

import { revalidatePath } from 'next/cache';

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
      error: error.message,
    };
  }
  revalidatePath('/', 'layout');
  return {
    user: {
      id: authData.user.id,
      email: authData.user.email,
    },
    error: null,
  };
}
