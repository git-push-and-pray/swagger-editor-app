import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SwaggerWorkspace } from './SwaggerWorkspace';

vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as { useTranslations: () => (key: string) => string };
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
    useLocale: () => 'en',
    useFormatter: () => ({}),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('@/features/editor/ui/SwaggerEditor', () => ({
  SwaggerEditor: () => <div>Swagger Editor</div>,
}));

describe('SwaggerWorkspace', () => {
  it('uses an orientation-based split layout', () => {
    const { container } = render(<SwaggerWorkspace />);

    const workspace = container.firstElementChild;

    expect(workspace).toHaveClass(
      'grid',
      'min-h-0',
      'flex-[1_1_0]',
      'grid-cols-1',
      'grid-rows-2',
      'landscape:grid-cols-2',
      'landscape:grid-rows-1'
    );
  });
});
