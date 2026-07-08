import { describe, expect, it } from 'vitest';

import { parseUrlWithLocale } from '../routingUtils';

describe('parseUrlWithLocale Utility', () => {
  const mockLocales = ['en', 'ru', 'be', 'uk'] as const;

  it('should correctly parse path with valid locale prefix', () => {
    const result = parseUrlWithLocale('/en/history/items', mockLocales);
    expect(result).toEqual({
      locale: 'en',
      relativePath: '/history/items',
    });
  });

  it('should return empty string for locale if prefix is missing or invalid', () => {
    const result = parseUrlWithLocale('/dashboard/settings', mockLocales);
    expect(result).toEqual({
      locale: '',
      relativePath: '/dashboard/settings',
    });
  });

  it('should handle root paths with only locale correctly', () => {
    const result = parseUrlWithLocale('/ru', mockLocales);
    expect(result).toEqual({
      locale: 'ru',
      relativePath: '/',
    });
  });

  it('should handle pure root paths correctly', () => {
    const result = parseUrlWithLocale('/', mockLocales);
    expect(result).toEqual({
      locale: '',
      relativePath: '/',
    });
  });
});
