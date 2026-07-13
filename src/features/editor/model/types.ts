import type { OpenAPI } from 'openapi-types';

export type SchemaFormat = 'json' | 'yaml';

export interface SchemaError {
  message: string;
  line?: number;
  column?: number;
}

export type SchemaParseResult =
  | {
      status: 'empty';
    }
  | {
      status: 'success';
      format: SchemaFormat;
      document: unknown;
    }
  | {
      status: 'error';
      errors: SchemaError[];
    };

export type SchemaValidationResult =
  | {
      status: 'valid';
      document: OpenAPI.Document;
    }
  | {
      status: 'invalid';
      errors: SchemaError[];
    };

export type SchemaEditorState =
  | {
      status: 'empty';
    }
  | {
      status: 'validating';
    }
  | SchemaValidationResult;

export type SaveSchemaSourceResult =
  | {
      success: true;
      error: null;
    }
  | {
      success: false;
      error: string;
    };

export interface SavedSchemaRow {
  userId: string;
  source: string;
  updatedAt: string;
}
