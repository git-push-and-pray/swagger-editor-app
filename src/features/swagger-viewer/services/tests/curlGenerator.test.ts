import { describe, expect, it } from 'vitest';

import type { HttpMethod } from '@/types/openapi';

import { generateCurl } from '../curlGenerator';

describe('generateCurl', () => {
  describe('basic request', () => {
    it('should generate GET request without headers or body', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        body: null,
      });

      expect(result).toBe('curl -X GET "https://api.example.com/users"');
    });

    it('should generate POST request with body', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {},
        body: { name: 'John', age: 30 },
      });

      expect(result).toContain('curl -X POST "https://api.example.com/users"');
      expect(result).toContain("-d '");
      expect(result).toContain('"name": "John"');
      expect(result).toContain('"age": 30');
    });

    it('should generate request with all HTTP methods', () => {
      const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

      for (const method of methods) {
        const result = generateCurl({
          method,
          url: 'https://api.example.com/resource',
          headers: {},
          body: null,
        });

        expect(result).toContain(`curl -X ${method}`);
      }
    });
  });

  describe('headers', () => {
    it('should include single header', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      });

      expect(result).toContain('-H "Content-Type: application/json"');
    });

    it('should include multiple headers', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
          'X-API-Key': 'secret-key',
        },
        body: null,
      });

      expect(result).toContain('-H "Content-Type: application/json"');
      expect(result).toContain('-H "Authorization: Bearer token123"');
      expect(result).toContain('-H "X-API-Key: secret-key"');
    });

    it('should escape double quotes in header values', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {
          Authorization: 'Bearer "token"',
        },
        body: null,
      });

      expect(result).toContain('-H "Authorization: Bearer \\"token\\""');
    });

    it('should skip headers with empty value', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
          'X-Empty': '',
          'X-Another': 'value',
        },
        body: null,
      });

      expect(result).toContain('-H "Content-Type: application/json"');
      expect(result).toContain('-H "X-Another: value"');
      expect(result).not.toContain('X-Empty');
    });

    it('should handle headers with special characters', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {
          'X-Custom': 'value with spaces',
          'X-Special': '!@#$%^&*()',
        },
        body: null,
      });

      expect(result).toContain('-H "X-Custom: value with spaces"');
      expect(result).toContain('-H "X-Special: !@#$%^&*()"');
    });
  });

  describe('body', () => {
    it('should include JSON body as object', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {},
        body: { name: 'John', age: 30, active: true },
      });

      expect(result).toContain("-d '");
      expect(result).toContain('"name": "John"');
      expect(result).toContain('"age": 30');
      expect(result).toContain('"active": true');
    });

    it('should include string body without JSON stringify', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {},
        body: 'plain text body',
      });

      expect(result).toContain("-d 'plain text body'");
    });

    it('should escape single quotes in body', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {},
        body: "John's data",
      });

      expect(result).toContain("-d 'John'\\''s data'");
    });

    it('should handle null body', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        body: null,
      });

      expect(result).not.toContain("-d '");
    });

    it('should handle undefined body', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {},
        body: undefined,
      });

      expect(result).not.toContain("-d '");
    });

    it('should handle nested object body', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {},
        body: {
          user: {
            name: 'John',
            address: {
              city: 'NYC',
              zip: '10001',
            },
          },
        },
      });

      expect(result).toContain('"user": {');
      expect(result).toContain('"name": "John"');
      expect(result).toContain('"address": {');
      expect(result).toContain('"city": "NYC"');
      expect(result).toContain('"zip": "10001"');
    });
  });

  describe('URL escaping', () => {
    it('should escape double quotes in URL', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users?query="test"',
        headers: {},
        body: null,
      });

      expect(result).toContain('"https://api.example.com/users?query=\\"test\\""');
    });

    it('should handle URL with special characters', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users?name=John&age=30',
        headers: {},
        body: null,
      });

      expect(result).toContain('"https://api.example.com/users?name=John&age=30"');
    });

    it('should handle URL with path parameters', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users/123/posts/456',
        headers: {},
        body: null,
      });

      expect(result).toContain('"https://api.example.com/users/123/posts/456"');
    });
  });

  describe('formatting', () => {
    it('should include line breaks for readability', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: { name: 'John' },
      });

      expect(result).toContain(' \\\n  -H');
      expect(result).toContain(' \\\n  -d');
    });

    it('should format JSON body with indentation', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {},
        body: { name: 'John', age: 30 },
      });

      expect(result).toContain('"name": "John"');
      expect(result).toContain('"age": 30');

      expect(result).toContain('\n  ');
    });

    it('should not add line breaks for single header', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null,
      });

      expect(result).toContain(' \\\n  -H "Content-Type: application/json"');
    });
  });

  describe('complex scenarios', () => {
    it('should generate full cURL with headers and body', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
        },
        body: { name: 'John', age: 30 },
      });

      const expectedParts = [
        'curl -X POST "https://api.example.com/users"',
        '-H "Content-Type: application/json"',
        '-H "Authorization: Bearer token123"',
        '-d \'{\n  "name": "John",\n  "age": 30\n}\'',
      ];

      for (const part of expectedParts) {
        expect(result).toContain(part);
      }
    });

    it('should handle empty headers and body', () => {
      const result = generateCurl({
        method: 'DELETE',
        url: 'https://api.example.com/resource/123',
        headers: {},
        body: null,
      });

      expect(result).toBe('curl -X DELETE "https://api.example.com/resource/123"');
    });

    it('should handle headers with special characters in values', () => {
      const result = generateCurl({
        method: 'GET',
        url: 'https://api.example.com/users',
        headers: {
          'X-Special': 'value with "quotes" and spaces',
        },
        body: null,
      });

      expect(result).toContain('-H "X-Special: value with \\"quotes\\" and spaces"');
    });

    it('should handle body with single quotes', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/messages',
        headers: {},
        body: "It's a test message",
      });

      expect(result).toContain("-d 'It'\\''s a test message'");
    });

    it('should handle body with double quotes', () => {
      const result = generateCurl({
        method: 'POST',
        url: 'https://api.example.com/messages',
        headers: {},
        body: 'He said "Hello" to me',
      });

      expect(result).toContain('-d \'He said "Hello" to me\'');
    });
  });
});
