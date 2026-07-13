import { describe, expect, it } from 'vitest';

import { formatResponseBody } from '../utils/formatResponseBody';

describe('formatResponseBody', () => {
  describe('with valid JSON', () => {
    it('should format JSON string with indentation', () => {
      const result = formatResponseBody('{"name":"John","age":30}');

      expect(result).toBe('{\n  "name": "John",\n  "age": 30\n}');
    });

    it('should format JSON object with indentation', () => {
      const result = formatResponseBody({ name: 'John', age: 30 });

      expect(result).toBe('{\n  "name": "John",\n  "age": 30\n}');
    });

    it('should format JSON array as string', () => {
      const result = formatResponseBody('[1, 2, 3]');

      expect(result).toBe('[\n  1,\n  2,\n  3\n]');
    });

    it('should format JSON array object', () => {
      const result = formatResponseBody([1, 2, 3]);

      expect(result).toBe('[\n  1,\n  2,\n  3\n]');
    });

    it('should format nested JSON object', () => {
      const result = formatResponseBody({
        user: {
          name: 'John',
          address: {
            city: 'NYC',
            zip: '10001',
          },
        },
      });

      expect(result).toContain('"user": {');
      expect(result).toContain('"name": "John"');
      expect(result).toContain('"address": {');
      expect(result).toContain('"city": "NYC"');
      expect(result).toContain('"zip": "10001"');
    });

    it('should format JSON with special characters', () => {
      const result = formatResponseBody('{"name":"John\\nDoe","active":true}');

      expect(result).toContain('"name": "John\\nDoe"');
      expect(result).toContain('"active": true');
    });

    it('should format JSON with null values', () => {
      const result = formatResponseBody('{"name":null,"age":30}');

      expect(result).toBe('{\n  "name": null,\n  "age": 30\n}');
    });

    it('should format JSON with boolean values', () => {
      const result = formatResponseBody('{"active":true,"verified":false}');

      expect(result).toBe('{\n  "active": true,\n  "verified": false\n}');
    });
  });

  describe('with invalid input', () => {
    it('should return undefined for null', () => {
      const result = formatResponseBody(null);

      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const result = formatResponseBody(undefined);

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = formatResponseBody('');

      expect(result).toBeUndefined();
    });

    it('should return stringified non-JSON string', () => {
      const result = formatResponseBody('plain text response');

      expect(result).toBe('plain text response');
    });

    it('should return stringified number', () => {
      const result = formatResponseBody(123);

      expect(result).toBe('123');
    });

    it('should return stringified boolean', () => {
      const result = formatResponseBody(true);

      expect(result).toBe('true');
    });

    it('should return string for invalid JSON string', () => {
      const result = formatResponseBody('{"name": "John",}');

      expect(result).toBe('{"name": "John",}');
    });
  });

  describe('with XML responses', () => {
    it('should return XML as plain string', () => {
      const xmlResponse =
        '<?xml version="1.0" encoding="UTF-8"?><user><id>1</id><name>John</name></user>';
      const result = formatResponseBody(xmlResponse);

      expect(result).toBe(xmlResponse);
    });
  });

  describe('with HTML responses', () => {
    it('should return HTML as plain string', () => {
      const htmlResponse = '<!DOCTYPE html><html><body><h1>Hello</h1></body></html>';
      const result = formatResponseBody(htmlResponse);

      expect(result).toBe(htmlResponse);
    });
  });

  describe('with error messages', () => {
    it('should return error message as string', () => {
      const errorResponse = 'Internal Server Error';
      const result = formatResponseBody(errorResponse);

      expect(result).toBe('Internal Server Error');
    });

    it('should return error object as string', () => {
      const errorObject = { error: 'Not Found', code: 404 };
      const result = formatResponseBody(errorObject);

      expect(result).toBe('{\n  "error": "Not Found",\n  "code": 404\n}');
    });
  });

  describe('edge cases', () => {
    it('should handle object with empty string values', () => {
      const result = formatResponseBody('{"name":"","age":0}');

      expect(result).toBe('{\n  "name": "",\n  "age": 0\n}');
    });

    it('should handle deeply nested object', () => {
      const deepObject = { a: { b: { c: { d: { e: 'deep' } } } } };
      const result = formatResponseBody(deepObject);

      expect(result).toContain('"a": {');
      expect(result).toContain('"b": {');
      expect(result).toContain('"c": {');
      expect(result).toContain('"d": {');
      expect(result).toContain('"e": "deep"');
    });

    it('should handle large object without crashing', () => {
      const largeObject: Record<string, number> = {};
      for (let i = 0; i < 100; i++) {
        largeObject[`key${i}`] = i;
      }
      const result = formatResponseBody(largeObject);

      expect(result).toContain('"key0": 0');
      expect(result).toContain('"key99": 99');
      expect(result).not.toBeUndefined();
    });
  });
});
