'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { OpenAPI } from 'openapi-types';

import MethodBadge from '@/components/ui/MethodBadge';
import type { Endpoint } from '@/types/openapi';

import EndpointDetails from './components/EndpointDetails';
import { ViewerHeader } from './components/ViewerHeader';
import { extractEndpoints, groupEndpointsByTag, sortEndpoints } from './services/endpointExtractor';

interface SwaggerViewerProps {
  document: OpenAPI.Document | null;
}

export function SwaggerViewer({ document }: SwaggerViewerProps) {
  const t = useTranslations('SwaggerViewer');
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
        <h3 className="font-semibold text-yellow-700">{t('waiting.title')}</h3>
        <p className="mt-1 text-yellow-600">{t('waiting.description')}</p>
      </div>
    );
  }

  if (!document.paths || Object.keys(document.paths).length === 0) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
        <h3 className="font-semibold text-yellow-700">{t('noEndpoints.title')}</h3>
        <p className="mt-1 text-yellow-600">{t('noEndpoints.description')}</p>
      </div>
    );
  }

  return (
    <section className="border-border bg-surface shadow-main flex h-full min-h-0 flex-col rounded-lg border">
      <ViewerHeader endpointsCount={endpoints.length} />

      {endpoints.length === 0 ? (
        <div className="py-8 text-center text-gray-500">{t('noEndpointsToDisplay')}</div>
      ) : (
        <div className="min-h-0 space-y-4 overflow-y-auto scroll-smooth border border-gray-200">
          {Array.from(groupedEndpoints.entries()).map(([tag, tagEndpoints]) => (
            <div key={tag} className="rounded-lg border border-gray-200">
              <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                {tag === 'default' ? t('defaultTag') : tag}
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
                        <MethodBadge method={endpoint.method} size="m" />

                        <span className="font-mono text-sm">{endpoint.path}</span>
                        {endpoint.summary && (
                          <span className="ml-2 text-sm text-gray-500">{endpoint.summary}</span>
                        )}
                        {endpoint.deprecated && (
                          <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                            {t('deprecated')}
                          </span>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                          {endpoint.parameters.length > 0 && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                              {endpoint.parameters.length} {t('parametersCount')}
                            </span>
                          )}
                          {endpoint.requestBody && (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              {t('body')}
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
    </section>
  );
}
