import { createClient } from '@/lib/supabase/server';

export async function getSavedSchemaSource(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from('saved_schemas')
    .select('source')
    .eq('userId', user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.source;
}
