import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import CodeMirror from '@uiw/react-codemirror';

import type { SchemaFormat } from '../model/types';

const FORMAT_EXTENSIONS = {
  json: [json()],
  yaml: [yaml()],
};

interface Props {
  value: string;
  format: SchemaFormat;
  onChange: (value: string) => void;
}

export function SchemaCodeEditor({ value, format, onChange }: Props) {
  return (
    <CodeMirror
      className="h-full"
      value={value}
      height="100%"
      extensions={FORMAT_EXTENSIONS[format]}
      onChange={onChange}
    />
  );
}
