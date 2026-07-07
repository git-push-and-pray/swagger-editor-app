'use client';

import { useState } from 'react';
import type { OpenAPI } from 'openapi-types';

import { SwaggerEditor } from '@/features/editor/ui/SwaggerEditor';

interface Props {
  initialSource?: string | null;
}

export function SwaggerWorkspace({ initialSource = null }: Props) {
  const [schemaDocument, setSchemaDocument] = useState<OpenAPI.Document | null>(null);

  return (
    <div className="grid min-h-0 flex-[1_1_0] grid-cols-1 grid-rows-2 gap-4 landscape:grid-cols-2 landscape:grid-rows-1">
      <SwaggerEditor initialSource={initialSource} onDocumentChange={setSchemaDocument} />

      {/* TODO: Replace this placeholder with <SwaggerViewer document={schemaDocument} /> */}
      <section className="border-border bg-surface min-h-0 overflow-hidden rounded-lg border">
        {schemaDocument && <p>{schemaDocument.info.title}</p>}
      </section>
    </div>
  );
}
