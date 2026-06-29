'use client';

import type { JSX } from 'react/jsx-runtime';
import { useLocale } from 'next-intl';

import Icon from '@/components/ui/Icon';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type LocaleType = (typeof routing.locales)[number];

const languageLabels: Record<LocaleType, string> = {
  en: 'ENG',
  ru: 'RUS',
  be: 'BEL',
  ua: 'UKR',
};

const languages = routing.locales.map((loc) => ({
  value: loc as LocaleType,
  label: languageLabels[loc],
}));

const SelectLanguage = (): JSX.Element => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, {
      locale: newLocale,
    });
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="offset-2 hover:bg-secondary min-w-22 cursor-pointer gap-0.5 border-none bg-transparent shadow-none">
        <div className="flex items-center gap-2">
          <Icon size="m" name="language" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value} className="flex items-center gap-2">
              <span>{lang.label}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectLanguage;
