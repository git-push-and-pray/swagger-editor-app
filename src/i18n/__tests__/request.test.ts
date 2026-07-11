import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetRequestConfig } = vi.hoisted(() => ({
  mockGetRequestConfig: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getRequestConfig: mockGetRequestConfig,
}));

vi.mock('../../../messages/en.json', () => ({
  default: { welcome: 'Welcome' },
}));

vi.mock('../../../messages/ru.json', () => ({
  default: { welcome: 'Добро пожаловать' },
}));

describe('Request Config Creator', () => {
  let capturedConfigFunction: (params: {
    requestLocale: Promise<string>;
  }) => Promise<{ locale: string; messages: unknown }>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockGetRequestConfig.mockImplementationOnce((fn: typeof capturedConfigFunction) => {
      capturedConfigFunction = fn;
      return {};
    });

    await import('../request');
  });

  it('should return correct configuration and messages for valid requested locale', async () => {
    const mockParams = { requestLocale: Promise.resolve('ru') };

    const result = await capturedConfigFunction(mockParams);

    expect(result.locale).toBe('ru');
    expect(result.messages).toEqual({ welcome: 'Добро пожаловать' });
  });

  it('should fallback to defaultLocale "en" if requested locale is invalid/missing', async () => {
    const mockParams = { requestLocale: Promise.resolve('fr') };

    const result = await capturedConfigFunction(mockParams);

    expect(result.locale).toBe('en');
    expect(result.messages).toEqual({ welcome: 'Welcome' });
  });
});
