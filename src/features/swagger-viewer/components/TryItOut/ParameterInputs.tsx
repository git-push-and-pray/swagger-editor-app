'use client';

import { useTranslations } from 'next-intl';

import type { ParameterObject } from '@/types/openapi';

interface ParameterInputsProps {
  parameters: ParameterObject[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}

export default function ParameterInputs({ parameters, values, onChange }: ParameterInputsProps) {
  const t = useTranslations('SwaggerViewer');
  const handleChange = (name: string, value: unknown) => {
    onChange({ ...values, [name]: value });
  };

  const visibleParams = parameters.filter((p) => p.in !== 'cookie');

  if (visibleParams.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h5 className="text-text-primary text-sm font-medium">{t('parameterInputs.title')}</h5>
      {visibleParams.map((param) => {
        const isPathParam = param.in === 'path';
        const isRequired = param.required || isPathParam;

        return (
          <div key={`${param.name}-${param.in}`} className="flex items-center gap-2">
            <div className="flex min-w-25 items-center gap-1">
              <span className="font-mono text-xs font-medium">{param.name}</span>
              <span className="bg-secondary/60 text-text-primary rounded px-1 text-xs">
                {param.in}
              </span>
              {isRequired && <span className="text-errordark text-xs">*</span>}
            </div>
            <input
              type="text"
              value={String(values[param.name] || '')}
              placeholder={param.description || param.name}
              className="border-border focus:border-info flex-1 rounded border p-1.5 text-sm focus:outline-none"
              onChange={(e) => handleChange(param.name, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
