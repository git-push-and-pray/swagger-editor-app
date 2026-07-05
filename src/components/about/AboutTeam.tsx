import type { JSX } from 'react/jsx-runtime';
import Image from 'next/image';

import type { TranslationProps } from '@/types/translation';

import ExternalLink from '../ui/ExternalLink';
import Icon from '../ui/Icon';
import { TEAM } from './teamInfo';

export default function AboutTeam({ t }: TranslationProps): JSX.Element {
  return (
    <div className="border-border bg-surface flex w-full flex-col gap-8 rounded-lg border p-8 shadow-lg lg:w-fit">
      <h2 className="text-text-primary flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
        <Icon name="team" className="text-accentdark" /> {t('team.title')}
      </h2>
      <div className="flex flex-col gap-6 lg:flex-row">
        {TEAM.map(({ name, avatar, alt, role, github, githubLink, ariaLabel }) => (
          <div
            key={name}
            className="bg-bg border-border flex w-full flex-col items-center justify-between rounded-md border p-5 shadow-md lg:w-60"
          >
            <Image
              src={avatar}
              width={48}
              height={48}
              alt={t(`team.${alt}`)}
              className="bg-secondary mb-4 rounded-full text-[8px]"
            />
            <span className="text-accentdark mb-1 text-center font-sans text-[10px] font-bold tracking-wide uppercase">
              {t(`team.${role}`)}
            </span>
            <h3 className="text-text-primary mb-3 text-center font-serif text-base font-medium">
              {t(`team.${name}`)}
            </h3>
            <ExternalLink
              href={githubLink}
              icon="github"
              iconPosition="left"
              size="sm"
              name={github}
              linkVersion="secondary"
              ariaLabel={t(`team.${ariaLabel}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
