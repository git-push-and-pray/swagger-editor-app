'use server';

import { getTranslations } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import type { RequestHistory } from '@/types/openapi';

type SaveRequestHistoryParams = Omit<RequestHistory, 'id' | 'timestamp' | 'userId'>;

export async function saveRequestHistory(params: SaveRequestHistoryParams) {
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

  const historyEntry: Omit<RequestHistory, 'id'> = {
    userId: user.id,
    timestamp: new Date().toISOString(),
    endpoint: params.endpoint,
    method: params.method,
    status: params.status,
    duration: params.duration,
    requestSize: params.requestSize ?? 0,
    responseSize: params.responseSize ?? 0,
    url: params.url,
    errorDetails: params.errorDetails ?? undefined,
  };

  const { error } = await supabase.from('request_history').insert(historyEntry);

  if (error) {
    const t = await getTranslations('SwaggerViewer');

    const { toast } = await import('sonner');
    toast.error(t('saveHistoryError'));

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
