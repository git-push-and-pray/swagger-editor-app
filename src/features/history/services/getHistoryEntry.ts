import { getUser } from '@/features/auth/utils/getUser';
import { createClient } from '@/lib/supabase/server';
import type { RequestHistory } from '@/types/historyEntry';

export async function getHistoryEntry(id: string): Promise<{
  entry: RequestHistory | null;
  error: boolean;
  unauthorized: boolean;
}> {
  const { user, authError } = await getUser();

  if (authError || !user) {
    return {
      entry: null,
      error: false,
      unauthorized: true,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('request_history')
    .select('*')
    .eq('userId', user.id)
    .eq('id', id)
    .single();

  if (error) {
    return {
      entry: null,
      error: true,
      unauthorized: false,
    };
  }

  return {
    entry: data,
    error: false,
    unauthorized: false,
  };
}
