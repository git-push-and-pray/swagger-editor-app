import type { User } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '@/lib/supabase/server';
import type { RequestHistory } from '@/types/historyEntry';

import { getRequestHistory } from '../services/getRequestHistory';

const { mockGetUser, mockSupabaseBuilder } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSupabaseBuilder: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn(),
  },
}));

vi.mock('@/features/auth/utils/getUser', () => ({
  getUser: mockGetUser,
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabaseBuilder),
}));

const mockUser = { id: 'user-abc-123' } as User;
const mockHistoryData = [
  { id: '1', endpoint: '/api/v1', method: 'GET' },
  { id: '2', endpoint: '/api/v2', method: 'POST' },
] as RequestHistory[];

describe('getRequestHistory Server Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unauthorized if getUser reports an auth error', async () => {
    mockGetUser.mockResolvedValueOnce({
      user: null,
      authError: true,
    });

    const result = await getRequestHistory();

    expect(result).toEqual({
      history: [],
      error: false,
      unauthorized: true,
    });
    expect(createClient).not.toHaveBeenCalled();
  });

  it('should return unauthorized if user is null/not found', async () => {
    mockGetUser.mockResolvedValueOnce({
      user: null,
      authError: false,
    });

    const result = await getRequestHistory();

    expect(result).toEqual({
      history: [],
      error: false,
      unauthorized: true,
    });
  });

  it('should return error true if supabase database query fails', async () => {
    mockGetUser.mockResolvedValueOnce({
      user: mockUser,
      authError: false,
    });

    mockSupabaseBuilder.order.mockResolvedValueOnce({
      data: null,
      error: { message: 'Database failure token' },
    });

    const result = await getRequestHistory();

    expect(mockSupabaseBuilder.from).toHaveBeenCalledWith('request_history');
    expect(mockSupabaseBuilder.eq).toHaveBeenCalledWith('userId', 'user-abc-123');
    expect(result).toEqual({
      history: [],
      error: true,
      unauthorized: false,
    });
  });

  it('should return database history records on a successful query execution', async () => {
    mockGetUser.mockResolvedValueOnce({
      user: mockUser,
      authError: false,
    });

    mockSupabaseBuilder.order.mockResolvedValueOnce({
      data: mockHistoryData,
      error: null,
    });

    const result = await getRequestHistory();

    expect(result).toEqual({
      history: mockHistoryData,
      error: false,
      unauthorized: false,
    });
  });

  it('should return an empty list if data from database is null but no error occurred', async () => {
    mockGetUser.mockResolvedValueOnce({
      user: mockUser,
      authError: false,
    });

    mockSupabaseBuilder.order.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const result = await getRequestHistory();

    expect(result.history).toEqual([]);
  });
});
