import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';

export async function getUser(): Promise<{
  user: User | null;
  authError: boolean;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    if (error.name === 'AuthSessionMissingError') {
      return {
        user: null,
        authError: false,
      };
    }
    return {
      user: null,
      authError: true,
    };
  }

  return {
    user: data.user,
    authError: false,
  };
}
