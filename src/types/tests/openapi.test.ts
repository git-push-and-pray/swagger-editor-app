import { describe, expect, it } from 'vitest';

import {
  isReferenceObject,
  resolveParameter,
  resolveParameters,
  resolveRequestBody,
  resolveResponse,
  resolveSchema,
  resolveSchemaDeep,
} from '../openapi';

describe('openapi type guards and resolvers', () => {
  describe('isReferenceObject', () => {
    it('should return true for ReferenceObject', () => {
      const ref = { $ref: '#/components/schemas/User' };
      expect(isReferenceObject(ref)).toBe(true);
    });

    it('should return false for ParameterObject', () => {
      const param = { name: 'id', in: 'path', schema: { type: 'integer' } };
      expect(isReferenceObject(param)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isReferenceObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isReferenceObject(undefined)).toBe(false);
    });

    it('should return false for object without $ref', () => {
      expect(isReferenceObject({ name: 'test' })).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isReferenceObject('string')).toBe(false);
      expect(isReferenceObject(123)).toBe(false);
      expect(isReferenceObject(true)).toBe(false);
    });
  });

  describe('resolveParameter', () => {
    it('should throw error when components.parameters is missing', () => {
      const ref = { $ref: '#/components/parameters/PageParam' };
      expect(() => resolveParameter(ref, {})).toThrow(
        'Не удалось найти параметр по ссылке: #/components/parameters/PageParam'
      );
    });
  });

  describe('resolveParameters', () => {
    it('should return empty array when params is undefined', () => {
      const result = resolveParameters(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array when params is empty', () => {
      const result = resolveParameters([]);
      expect(result).toEqual([]);
    });
  });

  describe('resolveRequestBody', () => {
    const components = {
      requestBodies: {
        UserBody: {
          description: 'User object',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    };

    it('should resolve ReferenceObject to RequestBodyObject', () => {
      const ref = { $ref: '#/components/requestBodies/UserBody' };
      const result = resolveRequestBody(ref, components);

      expect(result).toEqual({
        description: 'User object',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
              },
            },
          },
        },
      });
    });

    it('should return RequestBodyObject as is', () => {
      const body = {
        description: 'Test body',
        content: {
          'application/json': {
            schema: { type: 'object' },
          },
        },
      };
      const result = resolveRequestBody(body);

      expect(result).toBe(body);
    });

    it('should throw error when components.requestBodies is missing', () => {
      const ref = { $ref: '#/components/requestBodies/UserBody' };
      expect(() => resolveRequestBody(ref, {})).toThrow(
        'Не удалось найти requestBody по ссылке: #/components/requestBodies/UserBody'
      );
    });

    it('should throw error when requestBody not found', () => {
      const ref = { $ref: '#/components/requestBodies/MissingBody' };
      expect(() => resolveRequestBody(ref, components)).toThrow(
        'requestBody "MissingBody" не найден в components.requestBodies'
      );
    });
  });

  describe('resolveResponse', () => {
    const components = {
      responses: {
        UserResponse: {
          description: 'User object',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    };

    it('should resolve ReferenceObject to ResponseObject', () => {
      const ref = { $ref: '#/components/responses/UserResponse' };
      const result = resolveResponse(ref, components);

      expect(result).toEqual({
        description: 'User object',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
          },
        },
      });
    });

    it('should return ResponseObject as is', () => {
      const response = {
        description: 'OK',
        content: {
          'application/json': {
            schema: { type: 'object' },
          },
        },
      };
      const result = resolveResponse(response);

      expect(result).toBe(response);
    });

    it('should throw error when components.responses is missing', () => {
      const ref = { $ref: '#/components/responses/UserResponse' };
      expect(() => resolveResponse(ref, {})).toThrow(
        'Не удалось найти response по ссылке: #/components/responses/UserResponse'
      );
    });

    it('should throw error when response not found', () => {
      const ref = { $ref: '#/components/responses/MissingResponse' };
      expect(() => resolveResponse(ref, components)).toThrow(
        'response "MissingResponse" не найден в components.responses'
      );
    });
  });

  describe('resolveSchema', () => {
    const components = {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
          },
        },
        Address: {
          type: 'object',
          properties: {
            city: { type: 'string' },
            zip: { type: 'string' },
          },
        },
      },
    };

    it('should resolve ReferenceObject to SchemaObject', () => {
      const ref = { $ref: '#/components/schemas/User' };
      const result = resolveSchema(ref, components);

      expect(result).toEqual({
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      });
    });

    it('should return SchemaObject as is', () => {
      const schema = { type: 'string' };
      const result = resolveSchema(schema);

      expect(result).toBe(schema);
    });

    it('should throw error when components.schemas is missing', () => {
      const ref = { $ref: '#/components/schemas/User' };
      expect(() => resolveSchema(ref, {})).toThrow(
        'Не удалось найти schema по ссылке: #/components/schemas/User'
      );
    });

    it('should throw error when schema not found', () => {
      const ref = { $ref: '#/components/schemas/MissingSchema' };
      expect(() => resolveSchema(ref, components)).toThrow(
        'schema "MissingSchema" не найден в components.schemas'
      );
    });
  });

  describe('resolveSchemaDeep', () => {
    const components = {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            address: { $ref: '#/components/schemas/Address' },
          },
        },
        Address: {
          type: 'object',
          properties: {
            city: { type: 'string' },
            zip: { type: 'string' },
          },
        },
        UserWithAllOf: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/User' },
            { type: 'object', properties: { extra: { type: 'string' } } },
          ],
        },
        UserWithOneOf: {
          type: 'object',
          oneOf: [
            { $ref: '#/components/schemas/User' },
            { type: 'object', properties: { other: { type: 'string' } } },
          ],
        },
        UserWithAnyOf: {
          type: 'object',
          anyOf: [
            { $ref: '#/components/schemas/User' },
            { type: 'object', properties: { any: { type: 'string' } } },
          ],
        },
        Circular: {
          type: 'object',
          properties: {
            next: { $ref: '#/components/schemas/Circular' },
          },
        },
      },
    };

    it('should resolve nested references in properties', () => {
      const ref = { $ref: '#/components/schemas/User' };
      const result = resolveSchemaDeep(ref, components);

      expect(result).toEqual({
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          address: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              zip: { type: 'string' },
            },
          },
        },
      });
    });

    it('should resolve allOf references', () => {
      const ref = { $ref: '#/components/schemas/UserWithAllOf' };
      const result = resolveSchemaDeep(ref, components);

      expect(result).toEqual({
        type: 'object',
        allOf: [
          {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              address: {
                type: 'object',
                properties: {
                  city: { type: 'string' },
                  zip: { type: 'string' },
                },
              },
            },
          },
          { type: 'object', properties: { extra: { type: 'string' } } },
        ],
      });
    });

    it('should resolve oneOf references', () => {
      const ref = { $ref: '#/components/schemas/UserWithOneOf' };
      const result = resolveSchemaDeep(ref, components);

      expect(result).toEqual({
        type: 'object',
        oneOf: [
          {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              address: {
                type: 'object',
                properties: {
                  city: { type: 'string' },
                  zip: { type: 'string' },
                },
              },
            },
          },
          { type: 'object', properties: { other: { type: 'string' } } },
        ],
      });
    });

    it('should resolve anyOf references', () => {
      const ref = { $ref: '#/components/schemas/UserWithAnyOf' };
      const result = resolveSchemaDeep(ref, components);

      expect(result).toEqual({
        type: 'object',
        anyOf: [
          {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              address: {
                type: 'object',
                properties: {
                  city: { type: 'string' },
                  zip: { type: 'string' },
                },
              },
            },
          },
          { type: 'object', properties: { any: { type: 'string' } } },
        ],
      });
    });

    it('should return empty object when reference cannot be resolved', () => {
      const ref = { $ref: '#/components/schemas/Missing' };
      const result = resolveSchemaDeep(ref, components);

      expect(result).toEqual({});
    });

    it('should handle array items with references', () => {
      const componentsWithArray = {
        schemas: {
          UserList: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
            },
          },
        },
      };

      const ref = { $ref: '#/components/schemas/UserList' };
      const result = resolveSchemaDeep(ref, componentsWithArray);

      expect(result).toEqual({
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
          },
        },
      });
    });

    it('should return schema as is when no references', () => {
      const schema = { type: 'string' };
      const result = resolveSchemaDeep(schema);

      expect(result).toEqual({ type: 'string' });
    });

    it('should preserve schema properties', () => {
      const schema = {
        type: 'object',
        description: 'A user object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      };
      const result = resolveSchemaDeep(schema);

      expect(result).toEqual(schema);
    });
  });
});
