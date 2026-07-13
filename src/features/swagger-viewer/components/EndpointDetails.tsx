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
    <div className="mt-4 max-h-[400px] overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <MethodBadge method={endpoint.method} size="m" />
          <span className="font-mono text-lg font-semibold">{endpoint.path}</span>
          {endpoint.deprecated && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Deprecated</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Закрыть детали"
        >
          ✕
        </button>
      </div>

      {(endpoint.summary || endpoint.description) && (
        <div className="mt-3">
          {endpoint.summary && (
            <p className="text-sm font-medium text-gray-900">{endpoint.summary}</p>
          )}
          {endpoint.description && (
            <p className="mt-1 text-sm text-gray-600">{endpoint.description}</p>
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
      <div className="mt-4">
        <TryItOut endpoint={endpoint} />
      </div>
    </div>
  );
}
