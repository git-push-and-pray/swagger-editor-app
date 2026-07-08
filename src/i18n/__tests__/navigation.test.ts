import { createNavigation } from 'next-intl/navigation';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/navigation', () => ({
  createNavigation: vi.fn().mockReturnValue({
    Link: () => null,
    redirect: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
    getPathname: vi.fn(),
  }),
}));

describe('Navigation Module Initialization', () => {
  it('should initialize navigation methods using the defined routing', async () => {
    const navigation = await import('../navigation');

    expect(createNavigation).toHaveBeenCalledTimes(1);
    expect(navigation).toHaveProperty('Link');
    expect(navigation).toHaveProperty('redirect');
    expect(navigation).toHaveProperty('useRouter');
  });
});
