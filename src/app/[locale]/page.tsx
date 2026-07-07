import { getTranslations } from 'next-intl/server';

import { SwaggerWorkspace } from '@/features/workspace/ui/SwaggerWorkspace';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>

      <div className="workspace-page flex min-h-0 flex-[1_1_0] flex-col py-4">
        <SwaggerWorkspace />
      </div>
    </>
  );
}
