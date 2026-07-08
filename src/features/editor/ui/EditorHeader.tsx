import { useTranslations } from 'next-intl';

import Button from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';

import type { SchemaEditorState, SchemaFormat } from '../model/types';
import { EditorStatus } from './EditorStatus';

interface Props {
  format: SchemaFormat;
  status: SchemaEditorState['status'];
  isSaving: boolean;
  onFormatChange: (value: SchemaFormat) => void;
  onSave: () => void;
}

export function EditorHeader({ format, status, isSaving, onFormatChange, onSave }: Props) {
  const t = useTranslations('SwaggerEditor');

  const { user } = useAuth();
  const isAuth = !!user;

  const isSchemaValid = status === 'valid';

  return (
    <header className="border-border flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <h2 className="font-serif font-semibold">{t('title')}</h2>

        <div
          className="border-border bg-bg flex rounded-md border p-0.5"
          role="group"
          aria-label={t('formatAriaLabel')}
        >
          <button
            type="button"
            aria-pressed={format === 'json'}
            disabled={!isSchemaValid}
            className={`rounded px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
              format === 'json'
                ? 'bg-bg-active-tab text-text-primary shadow-btn'
                : 'text-text-secondary cursor-pointer'
            }`}
            onClick={() => onFormatChange('json')}
          >
            JSON
          </button>
          <button
            type="button"
            aria-pressed={format === 'yaml'}
            disabled={!isSchemaValid}
            className={`rounded px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
              format === 'yaml'
                ? 'bg-bg-active-tab text-text-primary shadow-btn'
                : 'text-text-secondary cursor-pointer'
            }`}
            onClick={() => onFormatChange('yaml')}
          >
            YAML
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <EditorStatus status={status} />

        {isAuth && (
          <Button
            icon="save"
            name={isSaving ? t('actions.saving') : t('actions.save')}
            size="sm"
            btnVersion="primary"
            disabled={!isSchemaValid || isSaving}
            onClick={onSave}
          />
        )}
      </div>
    </header>
  );
}
