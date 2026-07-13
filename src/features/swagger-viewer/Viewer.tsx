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
      <div className="border-warning/40 bg-warning/10 rounded-lg border p-4">
        <h3 className="text-warningdark font-semibold">{t('waiting.title')}</h3>
        <p className="text-warningdark/80 mt-1">{t('waiting.description')}</p>
      </div>
    );
  }

  if (!document.paths || Object.keys(document.paths).length === 0) {
    return (
      <div className="border-warning/40 bg-warning/10 rounded-lg border p-4">
        <h3 className="text-warningdark font-semibold">{t('noEndpoints.title')}</h3>
        <p className="text-warningdark/80 mt-1">{t('noEndpoints.description')}</p>
      </div>
    );
  }

  return (
    <section className="border-border bg-surface shadow-main flex h-full min-h-0 flex-col rounded-lg border">
      <ViewerHeader endpointsCount={endpoints.length} />

      {endpoints.length === 0 ? (
        <div className="text-text-secondary py-8 text-center">{t('noEndpointsToDisplay')}</div>
      ) : (
        <div className="min-h-0 space-y-4 overflow-y-auto scroll-smooth">
          {Array.from(groupedEndpoints.entries()).map(([tag, tagEndpoints]) => (
            <div key={tag} className="border-border mt-2 rounded-lg border pb-2 shadow-sm">
              <div className="text-text-secondary bg-secondary/50 px-4 py-2 font-semibold">
                {tag === 'default' ? t('defaultTag') : tag}
                <span className="text-text-secondary ml-2 text-sm font-normal">
                  ({tagEndpoints.length})
                </span>
              </div>
              <div className="mx-2 mt-3 flex flex-col gap-2">
                {tagEndpoints.map((endpoint, index) => (
                  <div
                    key={`${endpoint.method}-${endpoint.path}-${index}`}
                    className="border-border rounded-lg border shadow-xs"
                  >
                    <div
                      className={`bg-bg/50 hover:bg-surface cursor-pointer rounded-lg px-4 py-3 transition ${
                        selectedEndpoint === endpoint
                          ? 'bg-bg border-border rounded-b-none border-b'
                          : ''
                      }`}
                      onClick={() => handleEndpointClick(endpoint)}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-text-secondary text-xs">
                          {selectedEndpoint === endpoint ? '▼' : '▶'}
                        </span>
                        <MethodBadge method={endpoint.method} size="m" />

                        <span className="font-mono text-sm font-medium break-all">
                          {endpoint.path}
                        </span>
                        {endpoint.summary && (
                          <span className="text-text-secondary ml-2 font-sans text-sm font-medium">
                            {endpoint.summary}
                          </span>
                        )}
                        {endpoint.deprecated && (
                          <span className="text-errordark bg-error/15 rounded px-2 py-0.5 text-xs">
                            {t('deprecated')}
                          </span>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                          {endpoint.parameters.length > 0 && (
                            <span className="bg-secondary/60 text-text-primary rounded px-2 py-0.5 text-xs">
                              {t('parametersCount')}: {endpoint.parameters.length}
                            </span>
                          )}
                          {endpoint.requestBody && (
                            <span className="bg-info/15 text-infodark rounded px-2 py-0.5 text-xs">
                              {t('body')}
                            </span>
                          )}
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
