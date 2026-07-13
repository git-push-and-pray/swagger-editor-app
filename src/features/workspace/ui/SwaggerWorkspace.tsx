'use client';

import { useState } from 'react';
import type { OpenAPI } from 'openapi-types';

import { SwaggerEditor } from '@/features/editor/ui/SwaggerEditor';
import { SwaggerViewer } from '@/features/swagger-viewer/Viewer';

interface Props {
  initialSource?: string | null;
}

export function SwaggerWorkspace({ initialSource = null }: Props) {
  const [schemaDocument, setSchemaDocument] = useState<OpenAPI.Document | null>(null);

  return (
    <div className="grid min-h-0 flex-[1_1_0] grid-cols-1 grid-rows-2 gap-4 landscape:grid-cols-2 landscape:grid-rows-1">
      <SwaggerEditor initialSource={initialSource} onDocumentChange={setSchemaDocument} />
      <SwaggerViewer document={schemaDocument} />
    </div>
  );
}
