import type { JSX } from 'react/jsx-runtime';

import type { TranslationProps } from '@/types/translation';

import Icon from '../ui/Icon';
import { TECH_STACK } from './techStack';

export default function AboutTechStack({ t }: TranslationProps): JSX.Element {
  return (
    <div className="border-border bg-surface flex max-w-full flex-1 flex-col items-start gap-5 rounded-lg border p-6 shadow-lg md:max-w-101">
      <h2 className="text-text-primary flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
        <Icon name="code" className="text-accentdark" /> {t('tech.title')}
      </h2>
      <div className="flex flex-col items-start gap-3">
        {TECH_STACK.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-start gap-0.5">
            <span className="text-text-primary text-sm font-medium">
              {t(`tech.items.${label}`)}
            </span>
            <span className="text-text-secondary text-xs font-normal">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
