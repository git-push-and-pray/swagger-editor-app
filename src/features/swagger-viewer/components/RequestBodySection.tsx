'use client';

import { useTranslations } from 'next-intl';

import type { RequestBodyObject, SchemaObject } from '@/types/openapi';

import { generateExample } from '../shared/utils/generateExample';

interface RequestBodySectionProps {
  requestBody: RequestBodyObject;
}

export default function RequestBodySection({ requestBody }: RequestBodySectionProps) {
  const t = useTranslations('SwaggerViewer');

  const mediaTypes = Object.keys(requestBody.content || {});

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
      <div className="mt-2 space-y-2">
        {mediaTypes.map((mediaType) => {
          const mediaObject = requestBody.content?.[mediaType];
          const schema = mediaObject?.schema as SchemaObject | undefined;
          const directExample = mediaObject?.example;
          const exampleValue =
            directExample !== undefined
              ? directExample
              : schema
                ? generateExample(schema)
                : undefined;

          return (
            <div
              key={mediaType}
              className="border-border bg-secondary/30 space-y-2 rounded border p-2"
            >
              <div className="text-text-secondary text-xs font-medium">{mediaType}</div>

              {schema && (
                <div>
                  <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                    {t('requestBody.schema')}
                  </p>
                  <pre className="bg-foreground text-text-foreground mt-1 max-h-48 overflow-auto rounded p-2 text-xs">
                    {JSON.stringify(schema, null, 2)}
                  </pre>
                </div>
              )}

              {exampleValue !== undefined && (
                <div>
                  <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                    {t('requestBody.example')}
                  </p>
                  <pre className="bg-foreground text-text-foreground mt-1 max-h-40 overflow-auto rounded p-2 text-xs">
                    {JSON.stringify(exampleValue, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
