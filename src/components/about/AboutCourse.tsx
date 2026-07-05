import type { JSX } from 'react/jsx-runtime';

import type { TranslationProps } from '@/types/translation';

import ExternalLink from '../ui/ExternalLink';
import Icon from '../ui/Icon';

export default function AboutCourse({ t }: TranslationProps): JSX.Element {
  return (
    <div className="border-border bg-surface flex max-w-full flex-col items-start gap-5 rounded-lg border p-6 shadow-lg md:max-w-101">
      <h2 className="text-text-primary flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
        <Icon name="award" className="text-accentdark" /> {t('RSS.title')}
      </h2>
      <p className="text-text-secondary font-sans text-sm font-normal">{t('RSS.desc')}</p>
      <ExternalLink
        href="https://rs.school/courses/reactjs"
        icon="external-link"
        iconPosition="right"
        name={t('RSS.linkName')}
        ariaLabel={t('RSS.linkAria')}
        linkVersion="regular"
        size="sm"
      />
    </div>
  );
}
