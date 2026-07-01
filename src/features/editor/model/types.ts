export type SchemaFormat = 'json' | 'yaml';

export interface SchemaParserError {
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
      errors: SchemaParserError[];
    };
