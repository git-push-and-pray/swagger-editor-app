'use client';

import { useRef, useState } from 'react';
import type { OpenAPI } from 'openapi-types';

import { parseSchema } from '../lib/parse-schema';
import { serializeSchema } from '../lib/serialize-schema';
import { validateSchema } from '../lib/validate-schema';
import type { SchemaEditorState, SchemaFormat } from '../model/types';
import { EditorHeader } from './EditorHeader';
import { SchemaCodeEditor } from './SchemaCodeEditor';
import { SchemaErrorList } from './SchemaErrorList';

interface Props {
  onDocumentChange: (schemaDocument: OpenAPI.Document | null) => void;
}

export function SwaggerEditor({ onDocumentChange }: Props) {
  const [source, setSource] = useState('');
  const [format, setFormat] = useState<SchemaFormat>('json');
  const [editorState, setEditorState] = useState<SchemaEditorState>({ status: 'empty' });

  const validationRequestId = useRef(0);

  const handleSourceChange = (nextSource: string) => {
    setSource(nextSource);

    const requestId = ++validationRequestId.current;
    const parseResult = parseSchema(nextSource);

    if (parseResult.status === 'empty') {
      setEditorState({ status: 'empty' });
      onDocumentChange(null);
      return;
    }

    if (parseResult.status === 'error') {
      setEditorState({
        status: 'invalid',
        errors: parseResult.errors,
      });
      onDocumentChange(null);
      return;
    }

    setFormat(parseResult.format);
    setEditorState({ status: 'validating' });

    void validateSchema(parseResult.document).then((validationResult) => {
      if (requestId !== validationRequestId.current) {
        return;
      }

      setEditorState(validationResult);
      onDocumentChange(validationResult.status === 'valid' ? validationResult.document : null);
    });
  };

  const handleFormatChange = (nextFormat: SchemaFormat) => {
    if (nextFormat === format || editorState.status !== 'valid') {
      return;
    }

    const nextSource = serializeSchema(editorState.document, nextFormat);

    setSource(nextSource);
    setFormat(nextFormat);
  };

  return (
    <section className="border-border bg-surface shadow-main flex min-h-0 flex-col overflow-hidden rounded-lg border">
      <EditorHeader
        format={format}
        status={editorState.status}
        onFormatChange={handleFormatChange}
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <SchemaCodeEditor value={source} format={format} onChange={handleSourceChange} />
      </div>

      {editorState.status === 'invalid' && <SchemaErrorList errors={editorState.errors} />}
    </section>
  );
}
