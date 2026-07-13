import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProxyRequest, ProxyResponse } from '@/types/openapi';

import { sendRequest } from '../proxyService';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('sendRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('should send request to /api/proxy with correct payload', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        body: '{"data": "success"}',
        duration: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle GET request without body', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        body: '[]',
        duration: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle POST request with body', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name: 'John', age: 30 },
      };

      const mockResponse: ProxyResponse = {
        status: 201,
        statusText: 'Created',
        headers: { 'content-type': 'application/json' },
        body: '{"id": 1, "name": "John"}',
        duration: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle request with custom headers', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {
          Authorization: 'Bearer token123',
          'X-API-Key': 'secret',
        },
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        body: '[]',
        duration: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });
  });

  describe('error handling', () => {
    it('should return error response when fetch throws', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await sendRequest(request);

      expect(result).toEqual({
        status: 500,
        statusText: 'Internal Error',
        headers: {},
        body: '',
        duration: 0,
        error: 'Network error',
      });
    });

    it('should return error response when response is not ok', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValueOnce({ error: 'Not Found' }),
      });

      const result = await sendRequest(request);

      expect(result).toEqual({
        status: 500,
        statusText: 'Internal Error',
        headers: {},
        body: '',
        duration: 0,
        error: 'Not Found',
      });
    });

    it('should return "Request failed" when response error has no message', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValueOnce({}),
      });

      const result = await sendRequest(request);

      expect(result.error).toBe('Request failed');
    });

    it('should handle unknown error type', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      mockFetch.mockRejectedValueOnce('String error');

      const result = await sendRequest(request);

      expect(result.error).toBe('Unknown error');
    });
  });

  describe('response parsing', () => {
    it('should parse JSON response correctly', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        body: '{"id": 1, "name": "John"}',
        duration: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await sendRequest(request);

      expect(result).toEqual(mockResponse);
    });

    it('should handle response with empty body', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 204,
        statusText: 'No Content',
        headers: {},
        body: '',
        duration: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await sendRequest(request);

      expect(result).toEqual(mockResponse);
    });

    it('should handle response with error details from proxy', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValueOnce({ error: 'Database connection failed' }),
      });

      const result = await sendRequest(request);

      expect(result.status).toBe(500);
      expect(result.error).toBe('Database connection failed');
    });
  });

  describe('edge cases', () => {
    it('should handle request with query parameters in URL', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users?limit=10&offset=0',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        body: '[]',
        duration: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });

    it('should handle request with body as array', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: [1, 2, 3, 4, 5],
      };

      const mockResponse: ProxyResponse = {
        status: 201,
        statusText: 'Created',
        headers: {},
        body: '{"success": true}',
        duration: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });

    it('should handle request with nested object body', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          user: {
            name: 'John',
            address: {
              city: 'NYC',
              zip: '10001',
            },
          },
        },
      };

      const mockResponse: ProxyResponse = {
        status: 201,
        statusText: 'Created',
        headers: {},
        body: '{"success": true}',
        duration: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });

    it('should handle request with body as null', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'DELETE',
        headers: {},
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 204,
        statusText: 'No Content',
        headers: {},
        body: '',
        duration: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });

    it('should handle request with undefined body', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: undefined,
      };

      const mockResponse: ProxyResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        body: '[]',
        duration: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });

    it('should handle request with special characters in headers', async () => {
      const request: ProxyRequest = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {
          'X-Special': 'value with "quotes" and spaces',
        },
        body: null,
      };

      const mockResponse: ProxyResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        body: '[]',
        duration: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      await sendRequest(request);

      expect(mockFetch).toHaveBeenCalledWith('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });
  });
});
