'use client';

import MethodBadge from '@/components/ui/MethodBadge';
import type { Endpoint } from '@/types/openapi';

import TryItOut from './TryItOut/TryItOut';
import ParametersSection from './ParametersSection';
import RequestBodySection from './RequestBodySection';
import ResponsesSection from './ResponsesSection';

interface EndpointDetailsProps {
  endpoint: Endpoint;
  onClose: () => void;
}

export default function EndpointDetails({ endpoint, onClose }: EndpointDetailsProps) {
  return (
    <div className="bg-surface/80 max-h-100 overflow-y-auto rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <MethodBadge method={endpoint.method} size="m" />
          <span className="font-mono text-lg font-semibold">{endpoint.path}</span>
          {endpoint.deprecated && (
            <span className="bg-error/15 text-errordark rounded px-2 py-0.5 text-xs">
              Deprecated
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary cursor-pointer"
          aria-label="Закрыть детали"
        >
          ✕
        </button>
      </div>
      <div className="mt-4">
        <TryItOut endpoint={endpoint} />
      </div>
      {(endpoint.summary || endpoint.description) && (
        <div className="mt-3">
          {endpoint.summary && (
            <p className="text-text-primary text-sm font-medium">{endpoint.summary}</p>
          )}
          {endpoint.description && (
            <p className="text-text-secondary mt-1 text-sm">{endpoint.description}</p>
          )}
        </div>
      )}

      {endpoint.parameters.length > 0 && (
        <div className="mt-4">
          <ParametersSection parameters={endpoint.parameters} />
        </div>
      )}

      {endpoint.requestBody && (
        <div className="mt-4">
          <RequestBodySection requestBody={endpoint.requestBody} />
        </div>
      )}

      {Object.keys(endpoint.responses).length > 0 && (
        <div className="mt-4">
          <ResponsesSection responses={endpoint.responses} />
        </div>
      )}
    </div>
  );
}
