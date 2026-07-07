'use client';

import { useMemo, useState } from 'react';
import type { OpenAPI } from 'openapi-types';

import { extractEndpoints, groupEndpointsByTag, sortEndpoints } from '@/services/endpointExtractor';
import type { Endpoint } from '@/types/openapi';

import EndpointDetails from './components/EndpointDetails';

interface SwaggerViewerProps {
  document: OpenAPI.Document | null;
}

export function SwaggerViewer({ document }: SwaggerViewerProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

  const endpoints = useMemo(() => {
    if (!document || !document.paths) return [];
    return sortEndpoints(extractEndpoints(document));
  }, [document]);

  const groupedEndpoints = useMemo(() => {
    return groupEndpointsByTag(endpoints);
  }, [endpoints]);

  const handleEndpointClick = (endpoint: Endpoint) => {
    if (selectedEndpoint === endpoint) {
      setSelectedEndpoint(null);
    } else {
      setSelectedEndpoint(endpoint);
    }
  };

  const handleCloseDetails = () => {
    setSelectedEndpoint(null);
  };

  if (!document) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
        <h3 className="font-semibold text-yellow-700"> Ожидание схемы</h3>
        <p className="mt-1 text-yellow-600">Схема еще не загружена или не введена</p>
      </div>
    );
  }

  if (!document.paths || Object.keys(document.paths).length === 0) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
        <h3 className="font-semibold text-yellow-700"> Нет эндпоинтов</h3>
        <p className="mt-1 text-yellow-600">В схеме нет описанных эндпоинтов (paths)</p>
      </div>
    );
  }

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
                  <div key={`${endpoint.method}-${endpoint.path}-${index}`}>
                    <div
                      className={`cursor-pointer px-4 py-3 transition hover:bg-gray-50 ${
                        selectedEndpoint === endpoint ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleEndpointClick(endpoint)}
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
                        <div className="ml-auto flex items-center gap-2">
                          {endpoint.parameters.length > 0 && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                              {endpoint.parameters.length} параметров
                            </span>
                          )}
                          {endpoint.requestBody && (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              body
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {selectedEndpoint === endpoint ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedEndpoint === endpoint && (
                      <EndpointDetails endpoint={endpoint} onClose={handleCloseDetails} />
                    )}
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
