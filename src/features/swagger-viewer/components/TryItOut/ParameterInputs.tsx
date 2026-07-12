'use client';

import type { ParameterObject } from '@/types/openapi';

interface ParameterInputsProps {
  parameters: ParameterObject[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}

export default function ParameterInputs({ parameters, values, onChange }: ParameterInputsProps) {
  const handleChange = (name: string, value: unknown) => {
    onChange({ ...values, [name]: value });
  };
  const visibleParams = parameters.filter((p) => p.in !== 'cookie');

  if (visibleParams.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium text-gray-700">Параметры</h5>
      {visibleParams.map((param) => {
        const isPathParam = param.in === 'path';
        const isRequired = param.required || isPathParam;

        return (
          <div key={`${param.name}-${param.in}`} className="flex items-center gap-2">
            <div className="flex min-w-[100px] items-center gap-1">
              <span className="font-mono text-xs font-medium">{param.name}</span>
              <span className="rounded bg-gray-200 px-1 text-xs text-gray-600">{param.in}</span>
              {isRequired && <span className="text-xs text-red-500">*</span>}
            </div>
            <input
              type="text"
              value={String(values[param.name] || '')}
              placeholder={param.description || param.name}
              className="flex-1 rounded border border-gray-300 p-1.5 text-sm focus:border-blue-500 focus:outline-none"
              onChange={(e) => handleChange(param.name, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
