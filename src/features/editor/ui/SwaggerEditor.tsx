'use client';

import { useRef, useState } from 'react';

import { parseSchema } from '../lib/parse-schema';
import { validateSchema } from '../lib/validate-schema';
import type { SchemaEditorState, SchemaFormat } from '../model/types';
import { EditorHeader } from './EditorHeader';
import { SchemaCodeEditor } from './SchemaCodeEditor';
import { SchemaErrorList } from './SchemaErrorList';

export function SwaggerEditor() {
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
      return;
    }

    if (parseResult.status === 'error') {
      setEditorState({
        status: 'invalid',
        errors: parseResult.errors,
      });
      return;
    }

    setFormat(parseResult.format);
    setEditorState({ status: 'validating' });

    void validateSchema(parseResult.document).then((validationResult) => {
      if (requestId !== validationRequestId.current) {
        return;
      }

      setEditorState(validationResult);
    });
  };

  return (
    <section className="border-border bg-surface shadow-main flex min-h-150 flex-col rounded-lg border">
      <EditorHeader format={format} status={editorState.status} onFormatChange={setFormat} />

      <div className="flex min-h-0 flex-1 flex-col">
        <SchemaCodeEditor value={source} format={format} onChange={handleSourceChange} />
      </div>

      {editorState.status === 'invalid' && <SchemaErrorList errors={editorState.errors} />}
    </section>
  );
}
