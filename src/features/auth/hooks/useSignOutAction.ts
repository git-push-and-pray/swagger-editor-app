import { toast } from 'sonner';

import { signOutAction } from '@/app/[locale]/actions/signOut';
import { useRouter } from '@/i18n/navigation';
import type { TFunction } from '@/types/translation';

import type { SignOutResponse } from '../types/auth.types';
import { getNetworkError } from '../utils/getNetworkError';

interface UseSignOutActionResult {
  signOut: () => Promise<SignOutResponse>;
}

export const useSignOutAction = (t: TFunction): UseSignOutActionResult => {
  const router = useRouter();

  const signOut = async (): Promise<SignOutResponse> => {
    const toastId = toast.loading(t('loading.title'));

    try {
      const res = await signOutAction();

      if (res && res.error) {
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

      router.replace('/signin');

      return { error: null };
    } catch (fatalError) {
      const descriptionMessage = getNetworkError(fatalError, t);
      toast.error(t('error.title'), {
        id: toastId,
        description: descriptionMessage,
      });

      return {
        error: descriptionMessage,
      };
    }
  };

  return { signOut };
};
