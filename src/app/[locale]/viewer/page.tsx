'use client';

import { SwaggerProvider } from '@/context/SwaggerContext';
import { SwaggerViewerWrapper } from '@/features/swagger-viewer/ViewerWrapper';

export default function TestSwaggerPage() {
  return (
    <SwaggerProvider>
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Swagger Viewer</h1>
        <div className="rounded-lg border p-4">
          <SwaggerViewerWrapper />
        </div>
      </div>
    </SwaggerProvider>
  );
}
