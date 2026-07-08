import { redirect } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import RootPage from '@/app/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('RootPage Component', () => {
  it('should trigger a redirect to the default "/en" locale', () => {
    RootPage();

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith('/en');
  });
});
