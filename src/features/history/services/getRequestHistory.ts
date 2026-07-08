import { getUser } from '@/features/auth/utils/getUser';
import { createClient } from '@/lib/supabase/server';
import type { RequestHistory } from '@/types/historyEntry';

export async function getRequestHistory(): Promise<{
  history: RequestHistory[];
  error: boolean;
  unauthorized: boolean;
}> {
  const { user, authError } = await getUser();

  if (authError || !user) {
    return {
      history: [],
      error: false,
      unauthorized: true,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('request_history')
    .select('*')
    .eq('userId', user.id)
    .order('timestamp', { ascending: false });

  if (error) {
    return {
      history: [],
      error: true,
      unauthorized: false,
    };
  }

  return {
    history: data ?? [],
    error: false,
    unauthorized: false,
  };
}
