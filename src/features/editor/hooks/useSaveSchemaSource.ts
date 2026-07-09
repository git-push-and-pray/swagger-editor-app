import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { saveSchemaSource } from '../services/saveSchemaSource';

export function useSaveSchemaSource() {
  const t = useTranslations('SwaggerEditor');

  const [isSaving, setIsSaving] = useState(false);

  const saveSchema = async (source: string) => {
    setIsSaving(true);

    try {
      const result = await saveSchemaSource(source);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(t('notifications.saveSuccess'));
    } catch {
      toast.error(t('notifications.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveSchema,
  };
}
