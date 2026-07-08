import { parseSchema } from '../lib/parse-schema';
import type { SchemaEditorState, SchemaFormat } from '../model/types';

type InitialEditorSnapshot =
  | {
      source: string;
      format: SchemaFormat;
      editorState: SchemaEditorState;
      needsValidation: false;
    }
  | {
      source: string;
      format: SchemaFormat;
      editorState: SchemaEditorState;
      needsValidation: true;
      document: unknown;
    };

export function getInitialEditorSnapshot(initialSource: string | null): InitialEditorSnapshot {
  const source = initialSource ?? '';
  const parseResult = parseSchema(source);

  if (parseResult.status === 'empty') {
    return {
      source,
      format: 'json',
      editorState: { status: 'empty' },
      needsValidation: false,
    };
  }

  if (parseResult.status === 'error') {
    return {
      source,
      format: 'json',
      editorState: {
        status: 'invalid',
        errors: parseResult.errors,
      },
      needsValidation: false,
    };
  }

  return {
    source,
    format: parseResult.format,
    editorState: {
      status: 'validating',
    },
    needsValidation: true,
    document: parseResult.document,
  };
}
