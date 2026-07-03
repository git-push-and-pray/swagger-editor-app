'use client';

import dynamic from 'next/dynamic';

import { SwaggerProvider } from '@/context/SwaggerContext';

const SwaggerViewer = dynamic(() => import('./Viewer').then((mod) => mod.SwaggerViewer), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-500">Загрузка Swagger Viewer...</div>,
});

export function SwaggerViewerWrapper() {
  return (
    <SwaggerProvider>
      <SwaggerViewer />
    </SwaggerProvider>
  );
}
