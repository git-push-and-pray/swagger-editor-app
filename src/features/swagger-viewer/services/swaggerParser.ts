import YAML from 'yaml';

import type { ParseResult, SchemaFormat } from '@/types/openapi';

import { isValidOpenAPIObject } from '../shared/utils/typeQuards';

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
