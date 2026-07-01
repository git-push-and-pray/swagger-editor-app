// src/app/test-swagger/page.tsx
'use client';

import { SwaggerProvider } from '@/context/SwaggerContext';
import { SwaggerViewer } from '@/features/swagger-viewer/Viewer';

export default function TestSwaggerPage() {
  return (
    <SwaggerProvider>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🧪 Тест Swagger Viewer</h1>
        <div className="border rounded-lg p-4">
          <SwaggerViewer />
        </div>
      </div>
    </SwaggerProvider>
  );
}