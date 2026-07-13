'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ExampleObject, ResponseObject } from 'openapi-types-v3.1.0';

import type { SchemaObject } from '@/types/openapi';

import { generateExample } from '../shared/utils/generateExample';
import { objectToXml } from '../shared/utils/objectToXml';
import { isValidMediaObject } from '../shared/utils/typeQuards';

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

export default function ResponseItem({
  statusCode,
  response,
}: {
  statusCode: string;
  response: ResponseObject;
}) {
  const t = useTranslations('SwaggerViewer');
  const content = response.content;
  const hasContent = content && typeof content === 'object' && Object.keys(content).length > 0;

  const mediaTypes = hasContent && content ? Object.keys(content) : [];
  const [activeMediaType, setActiveMediaType] = useState(mediaTypes[0] || '');

  return (
    <div className="border-border bg-secondary/30 rounded border p-2">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold ${
            statusCode.startsWith('2')
              ? 'text-accentdark'
              : statusCode.startsWith('4') || statusCode.startsWith('5')
                ? 'text-errordark'
                : 'text-text-secondary'
          }`}
        >
          {statusCode}
        </span>
        <span className="text-text-primary text-sm">{response.description}</span>
      </div>

      {hasContent && content && mediaTypes.length > 0 && (
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
            const mediaObject = content[activeMediaType];
            if (!isValidMediaObject(mediaObject)) return null;

            const schema = mediaObject.schema as SchemaObject | undefined;
            const directExample = mediaObject.example;
            const exampleValue =
              directExample !== undefined
                ? directExample
                : schema
                  ? generateExample(schema)
                  : undefined;

            const namedExamples = mediaObject.examples
              ? Object.entries(mediaObject.examples).filter(([, ex]) => {
                  if (typeof ex !== 'object' || ex === null || '$ref' in ex) return false;
                  return (ex as ExampleObject).value !== undefined;
                })
              : [];

            return (
              <div className="mt-2 space-y-2">
                {mediaTypes.length === 1 && (
                  <span className="text-text-secondary text-xs font-medium">{activeMediaType}</span>
                )}

                {schema && (
                  <div>
                    <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                      {t('responses.schema')}
                    </p>
                    <pre className="bg-foreground text-text-foreground mt-1 max-h-48 overflow-auto rounded p-2 text-xs">
                      {formatByMediaType(schema, activeMediaType)}
                    </pre>
                  </div>
                )}

                {namedExamples.length > 0 ? (
                  <div>
                    <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                      {t('responses.examples')}
                    </p>
                    <div className="mt-1 space-y-1">
                      {namedExamples.map(([name, ex]) => (
                        <div key={name}>
                          <span className="text-text-secondary text-xs italic">{name}</span>
                          <pre className="bg-foreground/85 text-text-foreground mt-0.5 max-h-40 overflow-auto rounded p-2 text-xs">
                            {formatByMediaType((ex as ExampleObject).value, activeMediaType)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  exampleValue !== undefined && (
                    <div>
                      <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                        {t('responses.example')}
                      </p>
                      <pre className="bg-foreground text-text-foreground mt-1 max-h-40 overflow-auto rounded p-2 text-xs">
                        {formatByMediaType(exampleValue, activeMediaType)}
                      </pre>
                    </div>
                  )
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
