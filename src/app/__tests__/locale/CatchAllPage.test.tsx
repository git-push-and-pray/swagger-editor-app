import { notFound } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import CatchAllPage from '@/app/[locale]/[...rest]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('CatchAllPage Component', () => {
  it('should immediately trigger next.js notFound function', () => {
    CatchAllPage();
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
