import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { updateSession } from '../proxy';

const { mockCreateServerClientProxy } = vi.hoisted(() => ({
  mockCreateServerClientProxy: vi.fn(),
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockCreateServerClientProxy,
}));

describe('Supabase Proxy Update Session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');
  });

  it('should throw an error if env variables are missing', async () => {
    const req = new NextRequest(new URL('http://localhost:3000'));
    const res = new NextResponse();

    await expect(updateSession(req, res)).rejects.toThrow('Missing Supabase environment variables');
  });

  it('should refresh session and sync cookies across request and response', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://mock-url.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'mock-key');

    const mockUser = { id: 'user-999', email: 'proxy@test.com' };

    mockCreateServerClientProxy.mockReturnValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    });

    const req = new NextRequest(new URL('http://localhost:3000'));
    const res = new NextResponse();

    const reqCookieSetSpy = vi.spyOn(req.cookies, 'set');
    const resCookieSetSpy = vi.spyOn(res.cookies, 'set');

    const result = await updateSession(req, res);

    expect(result.user).toEqual(mockUser);
    expect(result.response).toBe(res);

    const callArgs = mockCreateServerClientProxy.mock.calls[0];
    const cookieConfig = callArgs[2].cookies;

    cookieConfig.setAll([{ name: 'sb-session', value: 'xyz', options: { secure: true } }]);

    expect(reqCookieSetSpy).toHaveBeenCalledWith('sb-session', 'xyz');
    expect(resCookieSetSpy).toHaveBeenCalledWith('sb-session', 'xyz', { secure: true });
  });
});
