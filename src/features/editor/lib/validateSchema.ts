import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPI } from 'openapi-types';

import type { SchemaValidationResult } from '../model/types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function validateSchema(document: unknown): Promise<SchemaValidationResult> {
  if (!isRecord(document)) {
    return {
      status: 'invalid',
      errors: [{ message: 'Schema root must be an object' }],
    };
  }

  const candidate = document as OpenAPI.Document;

  try {
    await SwaggerParser.validate(candidate, {
      mutateInputSchema: false,
    });

    return {
      status: 'valid',
      document: candidate,
    };
  } catch (error: unknown) {
    return {
      status: 'invalid',
      errors: [
        {
          message: error instanceof Error ? error.message : 'Schema validation failed',
        },
      ],
    };
  }
}
