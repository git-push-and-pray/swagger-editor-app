'use client';

import { useTranslations } from 'next-intl';

import type { ResponseObject, ResponsesObject } from '@/types/openapi';

import { isValidResponse } from '../shared/utils/typeQuards';
import ResponseItem from './ResponseItem';

interface ResponsesSectionProps {
  responses: ResponsesObject;
}

export default function ResponsesSection({ responses }: ResponsesSectionProps) {
  const t = useTranslations('SwaggerViewer');

  const validResponses = Object.entries(responses)
    .filter(([, response]) => isValidResponse(response))
    .map(([statusCode, response]) => ({
      statusCode,
      response: response as ResponseObject,
    }));

  if (validResponses.length === 0) {
    return (
      <div>
        <h4 className="text-text-primary text-sm font-semibold">{t('responses.title')}</h4>
        <p className="text-text-secondary mt-1 text-sm">{t('responses.noDescriptions')}</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-text-primary text-sm font-semibold">{t('responses.title')}</h4>
      <div className="mt-2 space-y-2">
        {validResponses.map(({ statusCode, response }) => (
          <ResponseItem key={statusCode} statusCode={statusCode} response={response} />
        ))}
      </div>
    </div>
  );
}
