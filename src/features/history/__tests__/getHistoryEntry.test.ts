import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getHistoryEntry } from '../services/getHistoryEntry';

const { mockGetUser, mockSupabaseBuilder } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSupabaseBuilder: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
}));

vi.mock('@/features/auth/utils/getUser', () => ({ getUser: mockGetUser }));
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabaseBuilder),
}));

describe('getHistoryEntry Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unauthorized if user is not logged in', async () => {
    mockGetUser.mockResolvedValueOnce({ user: null, authError: false });
    const result = await getHistoryEntry('123');
    expect(result.unauthorized).toBe(true);
  });

  it('should fetch single record from database successfully', async () => {
    mockGetUser.mockResolvedValueOnce({ user: { id: 'user-1' }, authError: false });
    mockSupabaseBuilder.single.mockResolvedValueOnce({
      data: { id: '123', endpoint: '/api' },
      error: null,
    });

    const result = await getHistoryEntry('123');
    expect(result.entry).toEqual({ id: '123', endpoint: '/api' });
    expect(result.error).toBe(false);
  });
});
