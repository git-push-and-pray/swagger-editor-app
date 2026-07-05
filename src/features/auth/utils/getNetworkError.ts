// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { useTranslations } from 'next-intl';

type TFunction = ReturnType<typeof useTranslations>;

export const getNetworkError = (fatalError: unknown, t: TFunction): string => {
  const error = fatalError instanceof Error ? fatalError : new Error(String(fatalError));

  const isNetwork =
    error.message.toLowerCase().includes('fetch') ||
    error.message.toLowerCase().includes('network');
  if (isNetwork) return t('error.network');

  return error.message || t('error.unknown');
};
