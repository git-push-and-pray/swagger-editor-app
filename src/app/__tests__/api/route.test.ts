import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/proxy/route';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('POST /api/proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: unknown) => {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  };

  const parseResponse = async (response: ReturnType<typeof POST>) => {
    const resolved = await response;
    return {
      status: resolved.status,
      data: await resolved.json(),
    };
  };

  describe('successful requests', () => {
    it('should proxy GET request and return response', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse = new Response('{"data":"success"}', {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
        },
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'GET',
        headers: {
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: undefined,
      });

      expect(result.data).toEqual({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
        },
        body: '{"data":"success"}',
        duration: expect.any(Number),
      });
    });

    it('should proxy POST request with body', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name: 'John', age: 30 },
      };

      const mockResponse = new Response('{"id":1,"name":"John"}', {
        status: 201,
        statusText: 'Created',
        headers: {
          'content-type': 'application/json',
        },
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: JSON.stringify({ name: 'John', age: 30 }),
      });

      expect(result.data).toEqual({
        status: 201,
        statusText: 'Created',
        headers: {
          'content-type': 'application/json',
        },
        body: '{"id":1,"name":"John"}',
        duration: expect.any(Number),
      });
    });

    it('should add default Content-Type when body exists and no Content-Type header', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: {},
        body: { name: 'John' },
      };

      const mockResponse = new Response('{"id":1}', {
        status: 201,
        statusText: 'Created',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'User-Agent': 'SwaggerViewer/1.0',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'John' }),
      });
    });

    it('should use custom headers from request', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {
          Authorization: 'Bearer token123',
          'X-API-Key': 'secret',
        },
        body: null,
      };

      const mockResponse = new Response('[]', {
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer token123',
          'X-API-Key': 'secret',
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: undefined,
      });
    });

    it('should use default method GET when method not provided', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        headers: {},
        body: null,
      };

      const mockResponse = new Response('[]', {
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'GET',
        headers: {
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: undefined,
      });
    });

    it('should handle PUT request with body', async () => {
      const requestBody = {
        url: 'https://api.example.com/users/123',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: { name: 'Jane' },
      };

      const mockResponse = new Response('{"id":123,"name":"Jane"}', {
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users/123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: JSON.stringify({ name: 'Jane' }),
      });

      expect(result.data.status).toBe(200);
    });
  });

  describe('error handling', () => {
    it('should return 400 when URL is missing', async () => {
      const requestBody = {
        method: 'GET',
        headers: {},
        body: null,
      };

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.status).toBe(400);
      expect(result.data).toEqual({ error: 'URL is required' });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return 500 when fetch fails', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.status).toBe(500);
      expect(result.data).toEqual({
        error: 'Network error',
        status: 500,
      });
    });

    it('should return 500 when fetch throws non-Error', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      mockFetch.mockRejectedValueOnce('String error');

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.status).toBe(500);
      expect(result.data).toEqual({
        error: 'Unknown error',
        status: 500,
      });
    });

    it('should handle JSON parsing error in request body', async () => {
      const request = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest;

      const result = await parseResponse(POST(request));

      expect(result.status).toBe(500);
      expect(result.data).toEqual({
        error: 'Invalid JSON',
        status: 500,
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle failed fetch with response', async () => {
      const requestBody = {
        url: 'https://api.example.com/users/999',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse = new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.data.status).toBe(404);
      expect(result.data.statusText).toBe('Not Found');
      expect(result.data.body).toBe('Not Found');
    });
  });

  describe('response processing', () => {
    it('should include duration in response', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse = new Response('[]', {
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.data.duration).toBeGreaterThanOrEqual(0);
      expect(typeof result.data.duration).toBe('number');
    });

    it('should preserve response headers', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      const headers = new Headers({
        'content-type': 'application/json',
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '99',
      });

      const mockResponse = new Response('[]', {
        status: 200,
        statusText: 'OK',
        headers,
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.data.headers).toEqual({
        'content-type': 'application/json',
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '99',
      });
    });
    it('should handle binary response', async () => {
      const requestBody = {
        url: 'https://api.example.com/image',
        method: 'GET',
        headers: {},
        body: null,
      };

      const binaryData = new Uint8Array([0x01, 0x02, 0x03]);
      const mockResponse = new Response(binaryData, {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'image/png',
        },
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.data.headers['content-type']).toBe('image/png');
    });

    it('should handle response with special characters in headers', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
      };

      const headers = new Headers({
        'content-type': 'application/json; charset=utf-8',
        'x-custom-header': 'value with special chars: !@#$%^&*()',
      });

      const mockResponse = new Response('[]', {
        status: 200,
        statusText: 'OK',
        headers,
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await parseResponse(POST(createRequest(requestBody)));

      expect(result.data.headers['x-custom-header']).toBe('value with special chars: !@#$%^&*()');
    });
  });

  describe('edge cases', () => {
    it('should handle URL with query parameters', async () => {
      const requestBody = {
        url: 'https://api.example.com/users?limit=10&offset=0',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse = new Response('[]', {
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users?limit=10&offset=0', {
        method: 'GET',
        headers: {
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: undefined,
      });
    });

    it('should handle URL with special characters', async () => {
      const requestBody = {
        url: 'https://api.example.com/users?name=John%20Doe',
        method: 'GET',
        headers: {},
        body: null,
      };

      const mockResponse = new Response('[]', {
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users?name=John%20Doe', {
        method: 'GET',
        headers: {
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: undefined,
      });
    });

    it('should handle body as array', async () => {
      const requestBody = {
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: [1, 2, 3],
      };

      const mockResponse = new Response('{"count":3}', {
        status: 201,
        statusText: 'Created',
        headers: {},
      });

      mockFetch.mockResolvedValueOnce(mockResponse);

      await parseResponse(POST(createRequest(requestBody)));

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SwaggerViewer/1.0',
        },
        body: JSON.stringify([1, 2, 3]),
      });
    });
  });
});
