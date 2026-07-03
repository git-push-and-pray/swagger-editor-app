import { describe, expect, it } from 'vitest';

import { validateSchema } from './validate-schema';

describe('validateSchema', () => {
  it('accepts a valid OpenAPI document', async () => {
    const document = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    const result = await validateSchema(document);

    expect(result).toEqual({
      status: 'valid',
      document,
    });
  });

  it('accepts a valid Swagger 2.0 document', async () => {
    const document = {
      swagger: '2.0',
      info: {
        title: 'Legacy API',
        version: '1.0.0',
      },
      paths: {},
    };

    const result = await validateSchema(document);

    expect(result).toEqual({
      status: 'valid',
      document,
    });
  });

  it('rejects an object that is not an OpenAPI document', async () => {
    const result = await validateSchema({ name: 'Not an API' });

    expect(result.status).toBe('invalid');

    if (result.status !== 'invalid') {
      throw new Error('Expected validation to fail');
    }

    expect(result.errors[0]?.message).toEqual(expect.any(String));
  });

  it('rejects a non-object value before OpenAPI validation', async () => {
    const result = await validateSchema('not an object');

    expect(result).toEqual({
      status: 'invalid',
      errors: [{ message: 'Schema root must be an object' }],
    });
  });

  it('does not mutate a document with internal references', async () => {
    const document = {
      openapi: '3.0.0',
      info: {
        title: 'Referenced API',
        version: '1.0.0',
      },
      paths: {
        '/users': {
          get: {
            responses: {
              '200': {
                $ref: '#/components/responses/Success',
              },
            },
          },
        },
      },
      components: {
        responses: {
          Success: {
            description: 'Successful response',
          },
        },
      },
    };

    const originalDocument = structuredClone(document);

    const result = await validateSchema(document);

    expect(result.status).toBe('valid');
    expect(document).toEqual(originalDocument);
  });
});
