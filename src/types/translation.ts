// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { useTranslations } from 'next-intl';

export type TFunction = ReturnType<typeof useTranslations>;

export interface TranslationProps {
  t: TFunction;
}
