import { describe, expect, it } from 'vitest';

import { routing } from '../routing';

describe('Routing Configuration', () => {
  it('should have the correct locales configuration', () => {
    expect(routing.locales).toEqual(['en', 'ru', 'be', 'uk']);
    expect(routing.defaultLocale).toBe('en');
    expect(routing.localePrefix).toBe('always');
  });
});
