'use client';

import { useTranslations } from 'next-intl';

import type { ParameterObject } from '@/types/openapi';

interface ParametersSectionProps {
  parameters: ParameterObject[];
}

export default function ParametersSection({ parameters }: ParametersSectionProps) {
  const t = useTranslations('SwaggerViewer');

  return (
    <div>
      <h4 className="text-text-primary text-sm font-semibold">{t('parameters.title')}</h4>
      <div className="mt-2 space-y-2">
        {parameters.map((param, index) => (
          <div key={index} className="border-border bg-secondary/30 rounded border p-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{param.name}</span>
              <span className="bg-secondary/60 text-text-primary rounded px-1.5 py-0.5 text-xs">
                {param.in}
              </span>
              {param.required && (
                <span className="text-errordark text-xs">{t('parameters.required')}</span>
              )}
              {param.description && (
                <span className="text-text-secondary text-xs">{param.description}</span>
              )}
            </div>
            {param.schema && (
              <div className="text-text-secondary mt-1 text-xs">
                <span>{t('parameters.type')} </span>
                <code className="bg-secondary/60 text-text-primary rounded px-1 py-0.5">
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
