import type { JSX } from 'react/jsx-runtime';

import type { TranslationProps } from '@/types/translation';

export default function AboutIntro({ t }: TranslationProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-text-primary text-center font-serif text-3xl leading-10 font-semibold tracking-tighter sm:text-4xl">
        {t('title')}
      </h1>
      <p className="text-text-secondary text-center font-sans text-base font-normal sm:max-w-[60%]">
        {t('desc')}
      </p>
    </div>
  );
}
