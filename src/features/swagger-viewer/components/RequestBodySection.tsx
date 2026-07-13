'use client';

import { useTranslations } from 'next-intl';

import type { RequestBodyObject } from '@/types/openapi';

interface RequestBodySectionProps {
  requestBody: RequestBodyObject;
}

export default function RequestBodySection({ requestBody }: RequestBodySectionProps) {
  const t = useTranslations('SwaggerViewer');

  const mediaTypes = Object.keys(requestBody.content || {});

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700">
        {t('requestBody.title')}
        {requestBody.required && (
          <span className="ml-2 text-xs text-red-500">{t('requestBody.required')}</span>
        )}
      </h4>
      {requestBody.description && (
        <p className="mt-1 text-sm text-gray-600">{requestBody.description}</p>
      )}
      <div className="mt-2 space-y-2">
        {mediaTypes.map((mediaType) => (
          <div key={mediaType} className="rounded border border-gray-100 bg-gray-50 p-2">
            <div className="text-xs font-medium text-gray-500">{mediaType}</div>
            {requestBody.content?.[mediaType]?.schema && (
              <pre className="mt-1 max-h-40 overflow-auto rounded bg-gray-800 p-2 text-xs text-gray-200">
                {JSON.stringify(requestBody.content[mediaType].schema, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
