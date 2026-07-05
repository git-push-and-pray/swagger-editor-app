import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SchemaCodeEditor } from './SchemaCodeEditor';

interface MockCodeMirrorProps {
  value: string;
  height?: string;
  className?: string;
  extensions: unknown[];
  onChange: (value: string) => void;
}

const mocks = vi.hoisted(() => ({
  codeMirror: vi.fn(),
  jsonExtension: { language: 'json' },
  yamlExtension: { language: 'yaml' },
}));

vi.mock('@codemirror/lang-json', () => ({
  json: () => mocks.jsonExtension,
}));

vi.mock('@codemirror/lang-yaml', () => ({
  yaml: () => mocks.yamlExtension,
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: (props: MockCodeMirrorProps) => {
    mocks.codeMirror(props);

    return (
      <textarea
        aria-label="Code editor"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
    );
  },
}));

describe('SchemaCodeEditor', () => {
  it('passes the value and JSON extension to CodeMirror', () => {
    render(<SchemaCodeEditor value="JSON source" format="json" onChange={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: 'Code editor' })).toHaveValue('JSON source');

    expect(mocks.codeMirror).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 'JSON source',
        height: '100%',
        className: 'h-full',
        extensions: [mocks.jsonExtension],
      })
    );
  });

  it('uses the YAML extension for YAML format', () => {
    render(<SchemaCodeEditor value="openapi: 3.0.0" format="yaml" onChange={vi.fn()} />);

    expect(mocks.codeMirror).toHaveBeenLastCalledWith(
      expect.objectContaining({
        extensions: [mocks.yamlExtension],
      })
    );
  });

  it('reports edited content through onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SchemaCodeEditor value="" format="json" onChange={onChange} />);

    const editor = screen.getByRole('textbox', { name: 'Code editor' });

    await user.click(editor);
    await user.paste('openapi');

    expect(onChange).toHaveBeenLastCalledWith('openapi');
  });
});
