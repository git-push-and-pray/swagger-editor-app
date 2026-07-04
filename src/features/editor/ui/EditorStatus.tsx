import Icon from '@/components/ui/Icon';

import type { SchemaEditorState } from '../model/types';

interface Props {
  status: SchemaEditorState['status'];
}

export function EditorStatus({ status }: Props) {
  return (
    <div className="text-sm" role="status">
      {status === 'validating' && <span className="text-text-secondary">Validating...</span>}
      {status === 'valid' && (
        <span className="text-accentdark flex items-center gap-1">
          <Icon name="check-circle" size="s" />
          Valid
        </span>
      )}
      {status === 'invalid' && (
        <span className="text-errordark flex items-center gap-1">
          <Icon name="alert" size="s" />
          Invalid
        </span>
      )}
    </div>
  );
}
