'use client';

import { useState } from 'react';

import type { SchemaFormat } from '../model/types';
import { SchemaCodeEditor } from './SchemaCodeEditor';

export function SwaggerEditor() {
  const [source, setSource] = useState('');
  const [format, setFormat] = useState<SchemaFormat>('json');

  const handleSourceChange = (nextSource: string) => {
    setSource(nextSource);
  };

  return (
    <section className="border-border bg-surface shadow-main flex min-h-150 flex-col rounded-lg border">
      <header className="border-border flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif font-semibold">Editor</h2>

          <div
            className="border-border bg-bg flex rounded-md border p-0.5"
            role="group"
            aria-label="Schema format"
          >
            <button
              type="button"
              aria-pressed={format === 'json'}
              className={`rounded px-3 py-1 text-sm ${
                format === 'json'
                  ? 'bg-bg-active-tab text-text-primary shadow-btn'
                  : 'text-text-secondary'
              }`}
              onClick={() => setFormat('json')}
            >
              JSON
            </button>
            <button
              type="button"
              aria-pressed={format === 'yaml'}
              className={`rounded px-3 py-1 text-sm ${
                format === 'yaml'
                  ? 'bg-bg-active-tab text-text-primary shadow-btn'
                  : 'text-text-secondary'
              }`}
              onClick={() => setFormat('yaml')}
            >
              YAML
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <SchemaCodeEditor value={source} format={format} onChange={handleSourceChange} />
      </div>
    </section>
  );
}
