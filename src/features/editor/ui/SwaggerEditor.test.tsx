import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import messages from '../../../../messages/en.json';
import { parseSchema } from '../lib/parse-schema';
import { SwaggerEditor } from './SwaggerEditor';

interface MockEditorProps {
  value: string;
  onChange: (value: string) => void;
}

vi.mock('./SchemaCodeEditor', () => ({
  SchemaCodeEditor: ({ value, onChange }: MockEditorProps) => (
    <textarea
      aria-label="Schema source"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

function renderEditor() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SwaggerEditor />
    </NextIntlClientProvider>
  );
}

async function renderEditorWithSource(source: string) {
  const user = userEvent.setup();

  renderEditor();

  const editor = screen.getByRole('textbox', {
    name: 'Schema source',
  }) as HTMLTextAreaElement;

  await user.click(editor);
  await user.paste(source);

  return { editor, user };
}

const VALID_DOCUMENT = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '1.0.0',
  },
  paths: {},
};

const VALID_JSON = JSON.stringify(VALID_DOCUMENT, null, 2);

const VALID_YAML = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths: {}
`;

const INVALID_YAML = `openapi: 3.0.0
info: [
`;

const INVALID_OPENAPI = `openapi: 3.0.0
info:
  title: Test API
paths: {}
`;

describe('SwaggerEditor', () => {
  it('starts empty with format switching disabled', () => {
    renderEditor();

    expect(screen.getByRole('textbox', { name: 'Schema source' })).toHaveValue('');
    expect(screen.getByRole('button', { name: 'JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeDisabled();
    expect(screen.queryByText('Valid')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
  });

  it('validates JSON and enables format switching', async () => {
    const { editor } = await renderEditorWithSource(VALID_JSON);

    expect(editor).toHaveValue(VALID_JSON);
    expect(await screen.findByText('Valid')).toBeInTheDocument();

    const jsonButton = screen.getByRole('button', { name: 'JSON' });
    const yamlButton = screen.getByRole('button', { name: 'YAML' });

    expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
    expect(jsonButton).toBeEnabled();
    expect(yamlButton).toBeEnabled();
  });

  it('auto-detects a valid YAML schema', async () => {
    const { editor } = await renderEditorWithSource(VALID_YAML);

    expect(editor).toHaveValue(VALID_YAML);
    expect(await screen.findByText('Valid')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'JSON' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'YAML' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('displays syntax errors and disables format switching', async () => {
    await renderEditorWithSource(INVALID_YAML);

    expect(await screen.findByText('Invalid')).toBeInTheDocument();

    const errorList = screen.getByRole('alert');

    expect(errorList).toHaveTextContent(/Line \d+/);
    expect(errorList).toHaveTextContent(/column \d+/);
    expect(screen.getByRole('button', { name: 'JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeDisabled();
  });

  it('displays OpenAPI validation errors', async () => {
    await renderEditorWithSource(INVALID_OPENAPI);

    expect(await screen.findByText('Invalid')).toBeInTheDocument();
    expect(screen.getByRole('alert')).not.toBeEmptyDOMElement();
    expect(screen.getByRole('button', { name: 'JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeDisabled();
  });

  it('converts JSON to YAML and back without data loss', async () => {
    const { editor, user } = await renderEditorWithSource(VALID_JSON);

    await screen.findByText('Valid');

    const yamlButton = screen.getByRole('button', { name: 'YAML' });
    const jsonButton = screen.getByRole('button', { name: 'JSON' });

    await user.click(yamlButton);

    expect(parseSchema(editor.value)).toEqual({
      status: 'success',
      format: 'yaml',
      document: VALID_DOCUMENT,
    });
    expect(yamlButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(jsonButton);

    expect(JSON.parse(editor.value)).toEqual(VALID_DOCUMENT);
    expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('returns to the empty state when the schema is removed', async () => {
    const { editor, user } = await renderEditorWithSource(VALID_JSON);

    await screen.findByText('Valid');

    await user.clear(editor);

    expect(editor).toHaveValue('');
    expect(screen.queryByText('Valid')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeDisabled();
  });
});
