import type { User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import proxy from '@/proxy';

import { parseUrlWithLocale } from '../i18n/routingUtils';
import { updateSession } from '../lib/supabase/proxy';

const { mockI18nRoutingInner } = vi.hoisted(() => ({
  mockI18nRoutingInner: vi.fn(),
}));

vi.mock('next-intl/middleware', () => ({
  default: vi.fn().mockImplementation(() => mockI18nRoutingInner),
}));

vi.mock('../i18n/routingUtils', () => ({
  parseUrlWithLocale: vi.fn(),
}));

vi.mock('../lib/supabase/proxy', () => ({
  updateSession: vi.fn(),
}));

const createMockRequest = (urlPath: string): NextRequest => {
  return new NextRequest(new URL(urlPath, 'http://localhost:3000'));
};

describe('Middleware Proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockI18nRoutingInner.mockReturnValue(new NextResponse(null, { status: 200 }));
  });

  it('should immediately return intlResponse if it is a redirect with a location header', async () => {
    const request = createMockRequest('/some-path');
    const redirectResponse = new NextResponse(null, {
      status: 307,
      headers: { location: 'http://localhost:3000/en/some-path' },
    });
    mockI18nRoutingInner.mockReturnValueOnce(redirectResponse);

    const result = await proxy(request);

    expect(result.status).toBe(307);
    expect(result.headers.get('location')).toBe('http://localhost:3000/en/some-path');
    expect(updateSession).not.toHaveBeenCalled();
  });

  it('should redirect unauthenticated user from protected history route', async () => {
    const request = createMockRequest('/en/history');

    vi.mocked(parseUrlWithLocale).mockReturnValueOnce({
      relativePath: '/history',
      locale: 'en',
    });

    vi.mocked(updateSession).mockResolvedValueOnce({
      response: new NextResponse(null, { status: 200 }),
      user: null,
    });

    const result = await proxy(request);

    expect(result.status).toBe(401);

    expect(result.headers.get('Content-Type')).toContain('text/html');
    expect(result.headers.get('WWW-Authenticate')).toBe('Bearer realm="swagger-editor-app"');

    const text = await result.text();
    expect(text).toContain('url=/en');
    expect(text).toContain('window.location.replace("/en")');
  });

  it('should redirect authenticated user away from auth routes (e.g. /signin)', async () => {
    const request = createMockRequest('/ru/signin');

    vi.mocked(parseUrlWithLocale).mockReturnValueOnce({
      relativePath: '/signin',
      locale: 'ru',
    });

    vi.mocked(updateSession).mockResolvedValueOnce({
      response: new NextResponse(null, { status: 200 }),
      user: {
        id: 'user-123',
        email: 'test@test.com',
      } as unknown as User,
    });

    const result = await proxy(request);

    expect(result.status).toBe(307);
    expect(result.headers.get('location')).toBe('http://localhost:3000/ru');
  });

  it('should pass through the response if route rules are satisfied', async () => {
    const request = createMockRequest('/en/dashboard');

    vi.mocked(parseUrlWithLocale).mockReturnValueOnce({
      relativePath: '/dashboard',
      locale: 'en',
    });

    const mockResponse = new NextResponse(null, { status: 200 });
    vi.mocked(updateSession).mockResolvedValueOnce({
      response: mockResponse,
      user: null,
    });

    const result = await proxy(request);

    expect(result).toBe(mockResponse);
    expect(result.status).toBe(200);
  });
});
