import type { SchemaObject } from '@/types/openapi';

export function generateExample(schema: SchemaObject): unknown {
  if (schema.example !== undefined) return schema.example;
  if (schema.enum && schema.enum.length > 0) return schema.enum[0];
  if (schema.type === 'object' || (!schema.type && schema.properties)) {
    const result: Record<string, unknown> = {};
    for (const [key, prop] of Object.entries(schema.properties || {})) {
      result[key] = generateExample(prop as SchemaObject);
    }
    return result;
  }
  if (schema.type === 'array') {
    return schema.items && typeof schema.items !== 'boolean'
      ? [generateExample(schema.items as SchemaObject)]
      : [];
  }
  if (schema.type === 'string') {
    if (schema.format === 'date-time') return '2024-01-01T00:00:00Z';
    if (schema.format === 'date') return '2024-01-01';
    if (schema.format === 'email') return 'user@example.com';
    if (schema.format === 'uri') return 'https://example.com';
    return 'string';
  }
  if (schema.type === 'number' || schema.type === 'integer') return 0;
  if (schema.type === 'boolean') return true;
  return null;
}
