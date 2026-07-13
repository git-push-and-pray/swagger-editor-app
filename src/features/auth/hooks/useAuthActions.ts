import { toast } from 'sonner';

import { useRouter } from '@/i18n/navigation';
import type { TFunction } from '@/types/translation';

import type { AuthResponse } from '../types/auth.types';
import { getNetworkError } from '../utils/getNetworkError';

type AuthAction<T> = (data: T) => Promise<AuthResponse>;

export const useAuthActions = (t: TFunction) => {
  const router = useRouter();

  const runAuth = <T>(action: AuthAction<T>, redirect: string = '/') => {
    return async (data: T): Promise<AuthResponse> => {
      const toastId = toast.loading(t('loading.title'));

      try {
        const res = await action(data);

        if (res && 'error' in res && res.error) {
          toast.error(t('error.title'), {
            id: toastId,
            description: t('error.description'),
          });

          return res;
        }

        toast.success(t('success.title'), {
          id: toastId,
          description: t('success.description'),
        });

        router.push(redirect);

        return res;
      } catch (fatalError: unknown) {
        const descriptionMessage = getNetworkError(fatalError, t);
        toast.error(t('error.title'), {
          id: toastId,
          description: descriptionMessage,
        });

        return {
          user: null,
          error: descriptionMessage,
        };
      }
    };
  };

  return { runAuth };
};
