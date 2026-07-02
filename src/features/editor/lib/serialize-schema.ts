import type { OpenAPI } from 'openapi-types';
import { stringify } from 'yaml';

import type { SchemaFormat } from '../model/types';

export function serializeSchema(document: OpenAPI.Document, format: SchemaFormat): string {
  if (format === 'json') {
    return JSON.stringify(document, null, 2);
  }

  return stringify(document);
}
