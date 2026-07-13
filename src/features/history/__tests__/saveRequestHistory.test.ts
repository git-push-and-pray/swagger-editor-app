import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => Promise.resolve(() => 'Failed to save request history')),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
const mockGetUser = vi.fn();
const mockAuth = { getUser: mockGetUser };
const mockSupabase = {
  auth: mockAuth,
  from: mockFrom,
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

import { getTranslations } from 'next-intl/server';
import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/server';

import { saveRequestHistory } from '../services/saveRequestHistory';

describe('saveRequestHistory', () => {
  const mockParams = {
    endpoint: '/users',
    method: 'GET' as const,
    url: 'https://api.example.com/users',
    status: 200,
    duration: 150,
    requestSize: 123,
    responseSize: 456,
    errorDetails: undefined,
  };

  const mockUser = { id: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful save', () => {
    it('should save history entry when user is authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: null });

      const result = await saveRequestHistory(mockParams);

      expect(createClient).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith('request_history');

      expect(mockInsert).toHaveBeenCalledWith({
        userId: mockUser.id,
        timestamp: expect.any(String),
        endpoint: mockParams.endpoint,
        method: mockParams.method,
        status: mockParams.status,
        duration: mockParams.duration,
        requestSize: mockParams.requestSize,
        responseSize: mockParams.responseSize,
        url: mockParams.url,
        errorDetails: undefined,
      });

      expect(result).toEqual({
        success: true,
        error: null,
      });
    });

    it('should save history entry with errorDetails', async () => {
      const paramsWithError = {
        ...mockParams,
        errorDetails: 'Not Found',
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: null });

      const result = await saveRequestHistory(paramsWithError);

      expect(mockInsert).toHaveBeenCalledWith({
        userId: mockUser.id,
        timestamp: expect.any(String),
        endpoint: paramsWithError.endpoint,
        method: paramsWithError.method,
        status: paramsWithError.status,
        duration: paramsWithError.duration,
        requestSize: paramsWithError.requestSize,
        responseSize: paramsWithError.responseSize,
        url: paramsWithError.url,
        errorDetails: 'Not Found',
      });

      expect(result).toEqual({
        success: true,
        error: null,
      });
    });

    it('should use default values for requestSize and responseSize when not provided', async () => {
      const paramsWithoutSizes = {
        ...mockParams,
        requestSize: undefined as unknown as number,
        responseSize: undefined as unknown as number,
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: null });

      await saveRequestHistory(paramsWithoutSizes);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          requestSize: 0,
          responseSize: 0,
        })
      );
    });
  });

  describe('authentication errors', () => {
    it('should return error when user is not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      const result = await saveRequestHistory(mockParams);

      expect(result).toEqual({
        success: false,
        error: 'User is not authenticated',
      });
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it('should return error when auth throws error', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: new Error('Auth error'),
      });

      const result = await saveRequestHistory(mockParams);

      expect(result).toEqual({
        success: false,
        error: 'User is not authenticated',
      });
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });

  describe('database errors', () => {
    it('should return error when insert fails and show toast', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const dbError = new Error('Database connection failed');
      mockInsert.mockResolvedValueOnce({ error: dbError });

      const result = await saveRequestHistory(mockParams);

      expect(getTranslations).toHaveBeenCalledWith('SwaggerViewer');
      expect(toast.error).toHaveBeenCalledWith('Failed to save request history');

      expect(result).toEqual({
        success: false,
        error: dbError.message,
      });
    });

    it('should handle insert error with generic message', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: new Error('Duplicate key') });

      const result = await saveRequestHistory(mockParams);

      expect(result).toEqual({
        success: false,
        error: 'Duplicate key',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle missing requestSize and responseSize', async () => {
      const paramsWithMissingSizes = {
        endpoint: '/users',
        method: 'POST' as const,
        url: 'https://api.example.com/users',
        status: 201,
        duration: 200,
        requestSize: undefined as unknown as number,
        responseSize: undefined as unknown as number,
        errorDetails: 'Created',
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: null });

      await saveRequestHistory(paramsWithMissingSizes);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          requestSize: 0,
          responseSize: 0,
          errorDetails: 'Created',
        })
      );
    });

    it('should handle POST request with body', async () => {
      const postParams = {
        endpoint: '/users',
        method: 'POST' as const,
        url: 'https://api.example.com/users',
        status: 201,
        duration: 200,
        requestSize: 150,
        responseSize: 50,
        errorDetails: undefined,
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: null });

      await saveRequestHistory(postParams);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          status: 201,
        })
      );
    });

    it('should handle DELETE request', async () => {
      const deleteParams = {
        endpoint: '/users/123',
        method: 'DELETE' as const,
        url: 'https://api.example.com/users/123',
        status: 204,
        duration: 100,
        requestSize: 0,
        responseSize: 0,
        errorDetails: undefined,
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: null });

      await saveRequestHistory(deleteParams);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          status: 204,
        })
      );
    });

    it('should handle request with error status', async () => {
      const errorParams = {
        endpoint: '/users/999',
        method: 'GET' as const,
        url: 'https://api.example.com/users/999',
        status: 404,
        duration: 50,
        requestSize: 0,
        responseSize: 50,
        errorDetails: 'Not Found',
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      mockInsert.mockResolvedValueOnce({ error: null });

      await saveRequestHistory(errorParams);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 404,
          errorDetails: 'Not Found',
        })
      );
    });
  });
});
