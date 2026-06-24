import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <h1 className="font-serif text-4xl leading-10 font-semibold tracking-tight">{t('title')}</h1>
  );
}
