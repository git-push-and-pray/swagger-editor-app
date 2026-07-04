import { useTranslations } from 'next-intl';

import type { SchemaError } from '../model/types';

interface Props {
  errors: SchemaError[];
}

export function SchemaErrorList({ errors }: Props) {
  const t = useTranslations('SwaggerEditor');

  return (
    <ul
      className="border-error/30 bg-error/10 text-errordark border-t px-4 py-2 text-sm"
      role="alert"
    >
      {errors.map((error) => (
        <li key={`${error.message}-${error.line}-${error.column}`}>
          {error.line !== undefined && (
            <span className="font-medium">
              {t('line', { line: error.line })}
              {error.column !== undefined && `, ${t('column', { column: error.column })}`}:{' '}
            </span>
          )}
          {error.message}
        </li>
      ))}
    </ul>
  );
}
