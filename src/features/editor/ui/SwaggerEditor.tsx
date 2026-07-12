'use client';

import { useEffect, useRef, useState } from 'react';
import type { OpenAPI } from 'openapi-types';

import { useSaveSchemaSource } from '../hooks/useSaveSchemaSource';
import { parseSchema } from '../lib/parseSchema';
import { serializeSchema } from '../lib/serializeSchema';
import { validateSchema } from '../lib/validateSchema';
import type { SchemaEditorState, SchemaFormat } from '../model/types';
import { getInitialEditorSnapshot } from '../utils/getInitialEditorSnapshot';
import { EditorHeader } from './EditorHeader';
import { SchemaCodeEditor } from './SchemaCodeEditor';
import { SchemaErrorList } from './SchemaErrorList';

interface Props {
  initialSource?: string | null;
  onDocumentChange: (schemaDocument: OpenAPI.Document | null) => void;
}

export function SwaggerEditor({ initialSource = null, onDocumentChange }: Props) {
  const { isSaving, saveSchema } = useSaveSchemaSource();

  const [initialSnapshot] = useState(() => getInitialEditorSnapshot(initialSource));
  const [source, setSource] = useState(initialSnapshot.source);
  const [format, setFormat] = useState<SchemaFormat>(initialSnapshot.format);
  const [editorState, setEditorState] = useState<SchemaEditorState>(initialSnapshot.editorState);

  const initialValidationDocument = useRef(
    initialSnapshot.needsValidation ? { document: initialSnapshot.document } : null
  );
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

  const handleSave = () => {
    if (editorState.status !== 'valid') return;

    saveSchema(source);
  };

  useEffect(() => {
    const pendingValidation = initialValidationDocument.current;

    if (!pendingValidation) {
      return;
    }

    const requestId = ++validationRequestId.current;
    let isActive = true;

    void validateSchema(pendingValidation.document).then((validationResult) => {
      if (!isActive || requestId !== validationRequestId.current) {
        return;
      }

      setEditorState(validationResult);
      onDocumentChange(validationResult.status === 'valid' ? validationResult.document : null);
    });

    return () => {
      isActive = false;
    };
  }, [onDocumentChange]);

  return (
    <section className="border-border bg-surface shadow-main flex min-h-0 flex-col overflow-hidden rounded-lg border">
      <EditorHeader
        format={format}
        status={editorState.status}
        isSaving={isSaving}
        onFormatChange={handleFormatChange}
        onSave={handleSave}
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <SchemaCodeEditor value={source} format={format} onChange={handleSourceChange} />
      </div>

      {editorState.status === 'invalid' && <SchemaErrorList errors={editorState.errors} />}
    </section>
  );
}
