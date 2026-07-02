import type { OpenAPI } from 'openapi-types';
import { describe, expect, it } from 'vitest';

import { parseSchema } from './parse-schema';
import { serializeSchema } from './serialize-schema';

const document: OpenAPI.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '1.0.0',
  },
  paths: {},
};

describe('serializeSchema', () => {
  it('serializes to JSON without data loss', () => {
    const source = serializeSchema(document, 'json');

    expect(parseSchema(source)).toEqual({
      status: 'success',
      format: 'json',
      document,
    });
  });

  it('serializes to YAML without data loss', () => {
    const source = serializeSchema(document, 'yaml');

    expect(parseSchema(source)).toEqual({
      status: 'success',
      format: 'yaml',
      document,
    });
  });
});
