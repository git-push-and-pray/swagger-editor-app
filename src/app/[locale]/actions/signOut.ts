'use server';

import { revalidatePath } from 'next/cache';

import type { SignOutResponse } from '@/features/auth/types/auth.types';
import { createClient } from '@/lib/supabase/server';

export async function signOutAction(): Promise<SignOutResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }
  revalidatePath('/', 'layout');
  return { error: null };
}
