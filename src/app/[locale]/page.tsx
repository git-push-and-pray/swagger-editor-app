import { getTranslations } from 'next-intl/server';

import { SwaggerEditor } from '@/features/editor/ui/SwaggerEditor';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>

      <div className="h-150 py-4">
        <SwaggerEditor />
      </div>
    </>
  );
}
