'use client';

import type { ParameterObject } from '@/types/openapi';

interface ParametersSectionProps {
  parameters: ParameterObject[];
}

export default function ParametersSection({ parameters }: ParametersSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700">Параметры</h4>
      <div className="mt-2 space-y-2">
        {parameters.map((param, index) => (
          <div key={index} className="rounded border border-gray-100 bg-gray-50 p-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{param.name}</span>
              <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                {param.in}
              </span>
              {param.required && <span className="text-xs text-red-500">обязательный</span>}
              {param.description && (
                <span className="text-xs text-gray-500">{param.description}</span>
              )}
            </div>
            {param.schema && (
              <div className="mt-1 text-xs text-gray-500">
                <span>Тип: </span>
                <code className="rounded bg-gray-200 px-1 py-0.5">
                  {param.schema.type || 'unknown'}
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
