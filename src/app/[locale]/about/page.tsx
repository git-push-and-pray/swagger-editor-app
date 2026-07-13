import type { JSX } from 'react/jsx-runtime';
import { getTranslations } from 'next-intl/server';

import AboutCourse from '@/components/about/AboutCourse';
import AboutIntro from '@/components/about/AboutIntro';
import AboutTeam from '@/components/about/AboutTeam';
import AboutTechStack from '@/components/about/AboutTechStack';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  return (
    <div className="flex flex-col items-center gap-10 px-2 py-8 sm:p-8">
      <AboutIntro t={t} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AboutCourse t={t} />
        <AboutTechStack t={t} />
      </div>
      <AboutTeam t={t} />
    </div>
  );
}
