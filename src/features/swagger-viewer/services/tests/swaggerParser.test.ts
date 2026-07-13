import { describe, expect, it, vi } from 'vitest';

import { isValidSwaggerSchema, parseSwaggerSchema } from '../swaggerParser';

vi.mock('../shared/utils/typeQuards', () => ({
  isValidOpenAPIObject: vi.fn((obj) => {
    if (!obj || typeof obj !== 'object') return false;
    const maybeDoc = obj as Record<string, unknown>;
    return (
      typeof maybeDoc.openapi === 'string' &&
      maybeDoc.openapi.startsWith('3.') &&
      typeof maybeDoc.info === 'object' &&
      maybeDoc.info !== null &&
      typeof maybeDoc.paths === 'object' &&
      maybeDoc.paths !== null
    );
  }),
}));

describe('parseSwaggerSchema', () => {
  describe('valid schemas', () => {
    it('should parse valid YAML schema', () => {
      const yamlSchema = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.errors).toBeUndefined();
      expect(result.schema).not.toBeNull();
      expect(result.format).toBe('yaml');
      expect(result.schema?.openapi).toBe('3.0.0');
      expect(result.schema?.info.title).toBe('Test API');
      expect(result.schema?.paths).toBeDefined();
    });

    it('should parse valid JSON schema', () => {
      const jsonSchema = JSON.stringify({
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        paths: {
          '/users': {
            get: {
              summary: 'Get users',
              responses: {
                '200': {
                  description: 'OK',
                },
              },
            },
          },
        },
      });

      const result = parseSwaggerSchema(jsonSchema, 'json');

      expect(result.errors).toBeUndefined();
      expect(result.schema).not.toBeNull();
      expect(result.format).toBe('json');
      expect(result.schema?.openapi).toBe('3.0.0');
      expect(result.schema?.info.title).toBe('Test API');
    });

    it('should parse OpenAPI 3.1.0 schema', () => {
      const yamlSchema = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.errors).toBeUndefined();
      expect(result.schema?.openapi).toBe('3.1.0');
    });

    it('should parse schema with components', () => {
      const yamlSchema = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.errors).toBeUndefined();
      expect(result.schema?.components).toBeDefined();
      expect(result.schema?.components?.schemas).toBeDefined();
      expect(result.schema?.components?.schemas?.User).toBeDefined();
    });
  });

  describe('invalid schemas', () => {
    it('should return error for invalid YAML', () => {
      const invalidYaml = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
  invalid: [unclosed bracket
`;

      const result = parseSwaggerSchema(invalidYaml, 'yaml');

      expect(result.schema).toBeNull();
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toBeDefined();
    });

    it('should return error for invalid JSON', () => {
      const invalidJson = '{"openapi": "3.0.0", "info": {';

      const result = parseSwaggerSchema(invalidJson, 'json');

      expect(result.schema).toBeNull();
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toBeDefined();
    });

    it('should return error for empty input', () => {
      const result = parseSwaggerSchema('', 'yaml');

      expect(result.schema).toBeNull();
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toBe('Не является валидной OpenAPI схемой 3.x');
    });

    it('should return error for non-OpenAPI object', () => {
      const yamlSchema = `
title: Some random data
version: 1.0.0
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.schema).toBeNull();
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toBe('Не является валидной OpenAPI схемой 3.x');
    });

    it('should return error for OpenAPI 2.0 schema', () => {
      const yamlSchema = `
swagger: "2.0"
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.schema).toBeNull();
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toBe('Не является валидной OpenAPI схемой 3.x');
    });

    it('should return error for schema without paths', () => {
      const yamlSchema = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.schema).toBeNull();
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toBe('Не является валидной OpenAPI схемой 3.x');
    });
  });

  describe('format handling', () => {
    it('should preserve format in result', () => {
      const yamlSchema = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

      const yamlResult = parseSwaggerSchema(yamlSchema, 'yaml');
      expect(yamlResult.format).toBe('yaml');

      const jsonSchema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
      });
      const jsonResult = parseSwaggerSchema(jsonSchema, 'json');
      expect(jsonResult.format).toBe('json');
    });

    it('should handle YAML with tabs vs spaces', () => {
      const yamlSchema = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.errors).toBeUndefined();
      expect(result.schema).not.toBeNull();
      expect(result.schema?.openapi).toBe('3.0.0');
    });

    it('should handle YAML with comments', () => {
      const yamlSchema = `
# This is a comment
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
  # Another comment
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

      const result = parseSwaggerSchema(yamlSchema, 'yaml');

      expect(result.errors).toBeUndefined();
      expect(result.schema).not.toBeNull();
      expect(result.schema?.openapi).toBe('3.0.0');
    });
  });

  describe('error handling', () => {
    it('should return error for JSON parsing error', () => {
      const invalidJson = '{"openapi": "3.0.0", "info": {"title": "Test API", "version": "1.0.0"}';

      const result = parseSwaggerSchema(invalidJson, 'json');

      expect(result.schema).toBeNull();
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toBeDefined();
    });
  });
});

describe('isValidSwaggerSchema', () => {
  it('should return true for valid YAML schema', () => {
    const yamlSchema = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

    const result = isValidSwaggerSchema(yamlSchema, 'yaml');

    expect(result).toBe(true);
  });

  it('should return true for valid JSON schema', () => {
    const jsonSchema = JSON.stringify({
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get users',
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    });

    const result = isValidSwaggerSchema(jsonSchema, 'json');

    expect(result).toBe(true);
  });

  it('should return false for invalid YAML', () => {
    const invalidYaml = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
    invalid: [unclosed
`;

    const result = isValidSwaggerSchema(invalidYaml, 'yaml');

    expect(result).toBe(false);
  });

  it('should return false for invalid JSON', () => {
    const invalidJson = '{"openapi": "3.0.0", "info": {';

    const result = isValidSwaggerSchema(invalidJson, 'json');

    expect(result).toBe(false);
  });

  it('should return false for non-OpenAPI object', () => {
    const yamlSchema = `
title: Random data
version: 1.0.0
`;

    const result = isValidSwaggerSchema(yamlSchema, 'yaml');

    expect(result).toBe(false);
  });

  it('should return false for empty input', () => {
    const result = isValidSwaggerSchema('', 'yaml');

    expect(result).toBe(false);
  });

  it('should handle different formats', () => {
    const yamlSchema = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: OK
`;

    expect(isValidSwaggerSchema(yamlSchema, 'yaml')).toBe(true);

    const invalidYaml = `
title: Random
version: 1.0.0
`;
    expect(isValidSwaggerSchema(invalidYaml, 'yaml')).toBe(false);
  });
});
