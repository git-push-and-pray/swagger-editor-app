import { createClient } from '@/lib/supabase/server';
import type { RequestHistory } from '@/types/historyEntry';

export async function getRequestHistory(userId: string): Promise<RequestHistory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('request_history')
    .select('*')
    .eq('userId', userId)
    .order('timestamp', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
