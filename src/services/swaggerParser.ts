import YAML from 'yaml';

import type { OpenAPIObject, ParseResult, SchemaFormat } from '@/types/openapi';

function isValidOpenAPIObject(obj: unknown): obj is OpenAPIObject {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const maybeOpenAPI = obj as Record<string, unknown>;
  if (typeof maybeOpenAPI.openapi !== 'string') {
    return false;
  }

  if (!maybeOpenAPI.openapi.startsWith('3.')) {
    return false;
  }

  if (typeof maybeOpenAPI.paths !== 'object' || maybeOpenAPI.paths === null) {
    return false;
  }

  return true;
}

export function parseSwaggerSchema(input: string, format: SchemaFormat): ParseResult {
  try {
    let parsed: unknown;

    if (format === 'yaml') {
      parsed = YAML.parse(input);
    } else {
      parsed = JSON.parse(input);
    }

    if (!isValidOpenAPIObject(parsed)) {
      return {
        schema: null,
        format,
        errors: ['Не является валидной OpenAPI схемой 3.x'],
      };
    }

    return {
      schema: parsed,
      format,
    };
  } catch (error) {
    return {
      schema: null,
      format,
      errors: [error instanceof Error ? error.message : 'Ошибка парсинга схемы'],
    };
  }
}

export function isValidSwaggerSchema(input: string, format: SchemaFormat): boolean {
  const result = parseSwaggerSchema(input, format);
  return result.errors === undefined || result.errors.length === 0;
}
