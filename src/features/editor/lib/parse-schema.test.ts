import { describe, expect, it } from 'vitest';

import { parseSchema } from './parse-schema';

describe('parseSchema', () => {
  it('returns empty result for whitespace-only source', () => {
    const result = parseSchema('  \n\t');

    expect(result).toEqual({ status: 'empty' });
  });

  it('detects and parses JSON', () => {
    const document = {
      openapi: '3.0.0',
      paths: {},
    };

    const result = parseSchema(JSON.stringify(document));

    expect(result).toEqual({
      status: 'success',
      format: 'json',
      document,
    });
  });

  it('detects and parses YAML', () => {
    const source = `
openapi: 3.0.0
paths: {}
`;

    const result = parseSchema(source);

    expect(result).toEqual({
      status: 'success',
      format: 'yaml',
      document: {
        openapi: '3.0.0',
        paths: {},
      },
    });
  });

  it('returns syntax errors for invalid input', () => {
    const result = parseSchema('openapi: [\n');

    expect(result.status).toBe('error');

    if (result.status !== 'error') {
      throw new Error('Expected parsing to fail');
    }

    expect(result.errors).not.toHaveLength(0);
    expect(result.errors[0]).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        line: expect.any(Number),
        column: expect.any(Number),
      })
    );
  });
});
