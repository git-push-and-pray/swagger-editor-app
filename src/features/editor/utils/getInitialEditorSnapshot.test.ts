import { describe, expect, it } from 'vitest';

import { VALID_DOCUMENT } from '../test-utils/schemaFixtures';
import { getInitialEditorSnapshot } from './getInitialEditorSnapshot';

describe('getInitialEditorSnapshot', () => {
  it('creates an empty snapshot when source is null', () => {
    expect(getInitialEditorSnapshot(null)).toEqual({
      source: '',
      format: 'json',
      editorState: { status: 'empty' },
      needsValidation: false,
    });
  });

  it('creates an invalid snapshot for syntax errors', () => {
    const snapshot = getInitialEditorSnapshot('openapi: [\n');

    expect(snapshot.source).toBe('openapi: [\n');
    expect(snapshot.format).toBe('json');
    expect(snapshot.editorState.status).toBe('invalid');
    expect(snapshot.needsValidation).toBe(false);
  });

  it('creates a validation snapshot for valid JSON syntax', () => {
    expect(getInitialEditorSnapshot(JSON.stringify(VALID_DOCUMENT))).toEqual({
      source: JSON.stringify(VALID_DOCUMENT),
      format: 'json',
      editorState: { status: 'validating' },
      needsValidation: true,
      document: VALID_DOCUMENT,
    });
  });
});
