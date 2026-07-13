'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type { RequestBodyObject, SchemaObject } from '@/types/openapi';

import { generateExample } from '../shared/utils/generateExample';
import { objectToXml } from '../shared/utils/objectToXml';

function formatByMediaType(value: unknown, mediaType: string): string {
  if (mediaType.includes('xml')) {
    if (typeof value === 'object' && value !== null) {
      return objectToXml(value);
    }
    return String(value);
  }

  if (mediaType.includes('x-www-form-urlencoded')) {
    if (typeof value === 'object' && value !== null) {
      const params = new URLSearchParams();
      Object.entries(value).forEach(([key, val]) => {
        params.append(key, String(val));
      });
      return params.toString();
    }
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

interface RequestBodySectionProps {
  requestBody: RequestBodyObject;
}

export default function RequestBodySection({ requestBody }: RequestBodySectionProps) {
  const t = useTranslations('SwaggerViewer');

  const mediaTypes = Object.keys(requestBody.content || {});
  const [activeMediaType, setActiveMediaType] = useState(mediaTypes[0] || '');

  return (
    <div>
      <h4 className="text-text-primary text-sm font-semibold">
        {t('requestBody.title')}
        {requestBody.required && (
          <span className="text-errordark ml-2 text-xs">{t('requestBody.required')}</span>
        )}
      </h4>
      {requestBody.description && (
        <p className="text-text-secondary mt-1 text-sm">{requestBody.description}</p>
      )}
      <div className="mt-2">
        {mediaTypes.length > 1 && (
          <div className="border-border flex gap-2 border-b pb-1">
            {mediaTypes.map((mediaType) => (
              <button
                key={mediaType}
                onClick={() => setActiveMediaType(mediaType)}
                className={`px-2 py-1 text-xs font-medium ${
                  activeMediaType === mediaType
                    ? 'border-info text-infodark border-b-2'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {mediaType}
              </button>
            ))}
          </div>
        )}

        {(() => {
          const mediaObject = requestBody.content?.[activeMediaType];
          const schema = mediaObject?.schema as SchemaObject | undefined;
          const directExample = mediaObject?.example;
          const exampleValue =
            directExample !== undefined
              ? directExample
              : schema
                ? generateExample(schema)
                : undefined;

          return (
            <div className="border-border bg-secondary/30 mt-2 space-y-2 rounded border p-2">
              {mediaTypes.length === 1 && (
                <div className="text-text-secondary text-xs font-medium">{activeMediaType}</div>
              )}

              {schema && (
                <div>
                  <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                    {t('requestBody.schema')}
                  </p>
                  <pre className="bg-foreground text-text-foreground mt-1 max-h-48 overflow-auto rounded p-2 text-xs">
                    {formatByMediaType(schema, activeMediaType)}
                  </pre>
                </div>
              )}

              {exampleValue !== undefined && (
                <div>
                  <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                    {t('requestBody.example')}
                  </p>
                  <pre className="bg-foreground text-text-foreground mt-1 max-h-40 overflow-auto rounded p-2 text-xs">
                    {formatByMediaType(exampleValue, activeMediaType)}
                  </pre>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
