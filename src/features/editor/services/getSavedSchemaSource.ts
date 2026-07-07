import { createClient } from '@/lib/supabase/server';

export async function getSavedSchemaSource(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('Failed to get authenticated user:', userError.message);
    return null;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('saved_schemas')
    .select('source')
    .eq('userId', user.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load saved schema source:', error.message);
    return null;
  }

  return data?.source ?? null;
}
