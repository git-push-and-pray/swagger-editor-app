'use server';

import { createClient } from '@/lib/supabase/server';

import type { SavedSchemaRow, SaveSchemaSourceResult } from '../model/types';

export async function saveSchemaSource(source: string): Promise<SaveSchemaSourceResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: 'User is not authenticated',
    };
  }

  const savedSchema: SavedSchemaRow = {
    userId: user.id,
    source,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from('saved_schemas').upsert(savedSchema);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    error: null,
  };
}
