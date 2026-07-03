'use client';

import { useMemo } from 'react';

import { useSwaggerContext } from '@/context/SwaggerContext';
import { extractEndpoints, groupEndpointsByTag, sortEndpoints } from '@/services/endpointExtractor';
import { parseSwaggerSchema } from '@/services/swaggerParser';
import type { OpenAPIObject } from '@/types/openapi';

interface ParsedSchema {
  isValid: boolean;
  data: OpenAPIObject | null;
  error?: string;
}

export function SwaggerViewer() {
  const { schema, format } = useSwaggerContext();
  const parsed = useMemo<ParsedSchema>(() => {
    const result = parseSwaggerSchema(schema, format);

    if (result.errors && result.errors.length > 0) {
      return {
        isValid: false,
        data: null,
        error: result.errors.join(', '),
      };
    }

    return {
      isValid: true,
      data: result.schema,
    };
  }, [schema, format]);

  if (!parsed.isValid || !parsed.data) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4">
        <h3 className="font-semibold text-red-700"> Ошибка валидации</h3>
        <p className="mt-1 text-red-600">{parsed.error}</p>
        <div className="mt-2 text-xs text-gray-500">Формат: {format}</div>
      </div>
    );
  }
  const endpoints = extractEndpoints(parsed.data);
  const sortedEndpoints = sortEndpoints(endpoints);
  const groupedEndpoints = groupEndpointsByTag(sortedEndpoints);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold"> Swagger Viewer</h2>
        <span className="text-sm text-gray-500">{endpoints.length} эндпоинтов</span>
      </div>

      {endpoints.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Нет эндпоинтов для отображения</div>
      ) : (
        <div className="space-y-4">
          {Array.from(groupedEndpoints.entries()).map(([tag, tagEndpoints]) => (
            <div key={tag} className="overflow-hidden rounded-lg border">
              <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                {tag === 'default' ? 'Общие' : tag}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({tagEndpoints.length})
                </span>
              </div>
              <div className="divide-y">
                {tagEndpoints.map((endpoint, index) => (
                  <div
                    key={`${endpoint.method}-${endpoint.path}-${index}`}
                    className="px-4 py-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-bold ${
                          endpoint.method === 'GET'
                            ? 'bg-blue-100 text-blue-700'
                            : endpoint.method === 'POST'
                              ? 'bg-green-100 text-green-700'
                              : endpoint.method === 'PUT'
                                ? 'bg-yellow-100 text-yellow-700'
                                : endpoint.method === 'DELETE'
                                  ? 'bg-red-100 text-red-700'
                                  : endpoint.method === 'PATCH'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm">{endpoint.path}</span>
                      {endpoint.summary && (
                        <span className="ml-2 text-sm text-gray-500">{endpoint.summary}</span>
                      )}
                      {endpoint.deprecated && (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                          Deprecated
                        </span>
                      )}
                      {endpoint.parameters.length > 0 && (
                        <span className="ml-auto rounded bg-gray-100 px-2 py-0.5 text-xs">
                          {endpoint.parameters.length} параметров
                        </span>
                      )}
                      {endpoint.requestBody && (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          body
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
