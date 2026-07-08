import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: createClientMock,
}));

import { saveSchemaSource } from './saveSchemaSource';

describe('saveSchemaSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00.000Z'));
  });

  it('returns an error when user is not authenticated', async () => {
    createClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    });

    await expect(saveSchemaSource('source')).resolves.toEqual({
      success: false,
      error: 'User is not authenticated',
    });
  });

  it('saves schema source for authenticated user', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });

    createClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({ upsert }),
    });

    await expect(saveSchemaSource('openapi: 3.0.0')).resolves.toEqual({
      success: true,
      error: null,
    });

    expect(upsert).toHaveBeenCalledWith({
      userId: 'user-1',
      source: 'openapi: 3.0.0',
      updatedAt: '2026-01-01T12:00:00.000Z',
    });
  });

  it('returns an error when upsert fails', async () => {
    const upsert = vi.fn().mockResolvedValue({
      error: { message: 'Database error' },
    });

    createClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({ upsert }),
    });

    await expect(saveSchemaSource('source')).resolves.toEqual({
      success: false,
      error: 'Database error',
    });
  });
});
