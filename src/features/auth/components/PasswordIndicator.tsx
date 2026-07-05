'use client';

import { useTranslations } from 'next-intl';

import Icon from '@/components/ui/Icon';

import { validatePassword } from '../utils/passwordRules';

interface Props {
  value: string;
}

const PasswordIndicator = ({ value }: Props) => {
  const t = useTranslations('SignUpPage.requirements');
  const checks = validatePassword(value);

  const requirements = [
    { id: 'length', label: t('length'), isMet: checks.minLength },
    { id: 'letter', label: t('letter'), isMet: checks.hasLetter },
    { id: 'digit', label: t('digit'), isMet: checks.hasDigit },
    { id: 'special', label: t('special'), isMet: checks.hasSpecial },
  ];

  return (
    <div className="mt-2 mb-4 grid grid-cols-2 gap-x-4 gap-y-1 pl-1">
      {requirements.map((req) => (
        <div
          key={req.id}
          className={`flex items-center gap-2 text-xs font-medium transition-colors duration-150 sm:text-sm ${
            req.isMet ? 'text-[#0b7033]' : 'text-text-secondary/70'
          }`}
        >
          <Icon
            name="check"
            size="m"
            className={req.isMet ? 'text-accentdark' : 'text-text-secondary/40'}
          />
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordIndicator;
