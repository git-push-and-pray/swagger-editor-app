import type { SchemaEditorState, SchemaFormat } from '../model/types';

interface Props {
  format: SchemaFormat;
  status: SchemaEditorState['status'];
  onFormatChange: (value: SchemaFormat) => void;
}

export function EditorHeader({ format, status, onFormatChange }: Props) {
  return (
    <header className="border-border flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <h2 className="font-serif font-semibold">Editor</h2>

        <div
          className="border-border bg-bg flex rounded-md border p-0.5"
          role="group"
          aria-label="Schema format"
        >
          <button
            type="button"
            aria-pressed={format === 'json'}
            className={`rounded px-3 py-1 text-sm ${
              format === 'json'
                ? 'bg-bg-active-tab text-text-primary shadow-btn'
                : 'text-text-secondary'
            }`}
            onClick={() => onFormatChange('json')}
          >
            JSON
          </button>
          <button
            type="button"
            aria-pressed={format === 'yaml'}
            className={`rounded px-3 py-1 text-sm ${
              format === 'yaml'
                ? 'bg-bg-active-tab text-text-primary shadow-btn'
                : 'text-text-secondary'
            }`}
            onClick={() => onFormatChange('yaml')}
          >
            YAML
          </button>
        </div>
      </div>

      <div className="text-sm" aria-live="polite">
        {status === 'validating' && <span className="text-text-secondary">Validating...</span>}
        {status === 'valid' && <span className="text-accentdark">Valid</span>}
        {status === 'invalid' && <span className="text-errordark">Invalid</span>}
      </div>
    </header>
  );
}
