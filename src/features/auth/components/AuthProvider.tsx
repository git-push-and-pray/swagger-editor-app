'use client';

import { createContext, type ReactNode, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
  authError?: boolean;
}

export const AuthProvider = ({ children, initialUser, authError }: AuthProviderProps) => {
  const router = useRouter();
  const [clientUser, setClientUser] = useState<User | null | undefined>(undefined);
  const lastUserIdRef = useRef<string | undefined>(initialUser?.id);
  const hasShownAuthError = useRef(false);
  const t = useTranslations('errors');

  useEffect(() => {
    if (authError && !hasShownAuthError.current) {
      hasShownAuthError.current = true;
      toast.error(t('auth'));
    }
  }, [authError, t]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user || null;
      setClientUser(user);
      lastUserIdRef.current = user?.id;
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setClientUser(currentUser);

      const hasUserChanged = currentUser?.id !== lastUserIdRef.current;

      if (hasUserChanged) {
        lastUserIdRef.current = currentUser?.id;
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);
  const activeUser = authError ? null : clientUser === undefined ? initialUser : clientUser;
  return <AuthContext.Provider value={{ user: activeUser }}>{children}</AuthContext.Provider>;
};
