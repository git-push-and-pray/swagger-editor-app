import { parseDocument } from 'yaml';

import type { SchemaParseResult } from '../model/types';

export function parseSchema(source: string): SchemaParseResult {
  if (source.trim().length === 0) {
    return { status: 'empty' };
  }

  try {
    const document: unknown = JSON.parse(source);

    return {
      status: 'success',
      format: 'json',
      document,
    };
  } catch {
    const yamlDocument = parseDocument(source);

    if (yamlDocument.errors.length === 0) {
      return {
        status: 'success',
        format: 'yaml',
        document: yamlDocument.toJS(),
      };
    }

    return {
      status: 'error',
      errors: yamlDocument.errors.map((error) => ({
        message: error.message,
        line: error.linePos?.[0].line,
        column: error.linePos?.[0].col,
      })),
    };
  }
}
