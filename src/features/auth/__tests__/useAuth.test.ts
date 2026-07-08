import React from 'react';
import type { User } from '@supabase/supabase-js';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '../components/AuthProvider';
import { useAuth } from '../hooks/useAuth';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
  notFound: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

describe('useAuth Hook', () => {
  it('should throw an error if used outside of AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AuthProvider');

    consoleSpy.mockRestore();
  });

  it('should return context value when wrapped in AuthProvider', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@gmail.com',
    } as User;

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthContext.Provider, { value: { user: mockUser } }, children);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
  });
});
