'use client';

import { createContext, type ReactNode, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';

import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  const router = useRouter();
  const [clientUser, setClientUser] = useState<User | null | undefined>(undefined);
  const lastUserIdRef = useRef<string | undefined>(initialUser?.id);

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
  const activeUser = clientUser === undefined ? initialUser : clientUser;
  return <AuthContext.Provider value={{ user: activeUser }}>{children}</AuthContext.Provider>;
};
