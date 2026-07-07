import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { OpenAPI } from 'openapi-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import messages from '../../../../messages/en.json';
import { parseSchema } from '../lib/parse-schema';
import {
  INVALID_OPENAPI,
  INVALID_YAML,
  VALID_DOCUMENT,
  VALID_JSON,
  VALID_YAML,
} from '../test-utils/schemaFixtures';
import { SwaggerEditor } from './SwaggerEditor';

type OnDocumentChange = (schemaDocument: OpenAPI.Document | null) => void;
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

const { authUserMock, saveSchemaSourceMock, toastErrorMock, toastSuccessMock } = vi.hoisted(() => ({
  authUserMock: vi.fn(),
  saveSchemaSourceMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: authUserMock(),
  }),
}));

vi.mock('../services/saveSchemaSource', () => ({
  saveSchemaSource: saveSchemaSourceMock,
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

function renderEditor({
  initialSource,
  onDocumentChange = vi.fn(),
}: {
  initialSource?: string | null;
  onDocumentChange?: OnDocumentChange;
} = {}) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SwaggerEditor initialSource={initialSource} onDocumentChange={onDocumentChange} />
    </NextIntlClientProvider>
  );
}

async function renderEditorWithSource(
  source: string,
  onDocumentChange = vi.fn<OnDocumentChange>()
) {
  const user = userEvent.setup();

  renderEditor({ onDocumentChange });

  const editor = screen.getByRole('textbox', {
    name: 'Schema source',
  }) as HTMLTextAreaElement;

  await user.click(editor);
  await user.paste(source);

  return { editor, user, onDocumentChange };
}

describe('SwaggerEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authUserMock.mockReturnValue(null);
  });

  it('starts empty with format switching disabled', () => {
    renderEditor();

    expect(screen.getByRole('textbox', { name: 'Schema source' })).toHaveValue('');
    expect(screen.getByRole('button', { name: 'JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeDisabled();
    expect(screen.queryByText('Valid')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
  });

  it('validates JSON and enables format switching', async () => {
    const { editor, onDocumentChange } = await renderEditorWithSource(VALID_JSON);

    expect(editor).toHaveValue(VALID_JSON);
    expect(await screen.findByText('Valid')).toBeInTheDocument();
    expect(onDocumentChange).toHaveBeenLastCalledWith(VALID_DOCUMENT);

    const jsonButton = screen.getByRole('button', { name: 'JSON' });
    const yamlButton = screen.getByRole('button', { name: 'YAML' });

    expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
    expect(jsonButton).toBeEnabled();
    expect(yamlButton).toBeEnabled();
  });

  it('auto-detects a valid YAML schema', async () => {
    const { editor, onDocumentChange } = await renderEditorWithSource(VALID_YAML);

    expect(editor).toHaveValue(VALID_YAML);
    expect(await screen.findByText('Valid')).toBeInTheDocument();
    expect(onDocumentChange).toHaveBeenLastCalledWith(VALID_DOCUMENT);

    expect(screen.getByRole('button', { name: 'JSON' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'YAML' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('displays syntax errors and disables format switching', async () => {
    const { onDocumentChange } = await renderEditorWithSource(INVALID_YAML);

    expect(await screen.findByText('Invalid')).toBeInTheDocument();
    expect(onDocumentChange).toHaveBeenLastCalledWith(null);

    const errorList = screen.getByRole('alert');

    expect(errorList).toHaveTextContent(/Line \d+/);
    expect(errorList).toHaveTextContent(/column \d+/);
    expect(screen.getByRole('button', { name: 'JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeDisabled();
  });

  it('displays OpenAPI validation errors', async () => {
    const { onDocumentChange } = await renderEditorWithSource(INVALID_OPENAPI);

    expect(await screen.findByText('Invalid')).toBeInTheDocument();
    expect(onDocumentChange).toHaveBeenLastCalledWith(null);
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
    const { editor, user, onDocumentChange } = await renderEditorWithSource(VALID_JSON);

    await screen.findByText('Valid');
    expect(onDocumentChange).toHaveBeenLastCalledWith(VALID_DOCUMENT);

    await user.clear(editor);

    expect(onDocumentChange).toHaveBeenLastCalledWith(null);
    expect(editor).toHaveValue('');
    expect(screen.queryByText('Valid')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'JSON' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeDisabled();
  });

  it('restores and validates initial YAML source', async () => {
    const onDocumentChange = vi.fn();

    renderEditor({
      initialSource: VALID_YAML,
      onDocumentChange,
    });

    expect(screen.getByRole('textbox', { name: 'Schema source' })).toHaveValue(VALID_YAML);

    expect(await screen.findByText('Valid')).toBeInTheDocument();
    expect(onDocumentChange).toHaveBeenLastCalledWith(VALID_DOCUMENT);

    expect(screen.getByRole('button', { name: 'JSON' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'YAML' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows syntax errors from initial source', async () => {
    const onDocumentChange = vi.fn();

    renderEditor({
      initialSource: INVALID_YAML,
      onDocumentChange,
    });

    expect(screen.getByRole('textbox', { name: 'Schema source' })).toHaveValue(INVALID_YAML);
    expect(await screen.findByText('Invalid')).toBeInTheDocument();

    expect(screen.getByRole('alert')).not.toBeEmptyDOMElement();
    expect(onDocumentChange).not.toHaveBeenCalled();
  });

  it('saves a valid schema for authenticated users', async () => {
    authUserMock.mockReturnValue({ id: 'user-1' });
    saveSchemaSourceMock.mockResolvedValue({
      success: true,
      error: null,
    });

    const { user } = await renderEditorWithSource(VALID_JSON);

    await screen.findByText('Valid');

    await user.click(screen.getByRole('button', { name: messages.SwaggerEditor.actions.save }));

    expect(saveSchemaSourceMock).toHaveBeenCalledWith(VALID_JSON);

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith(
        messages.SwaggerEditor.notifications.saveSuccess
      );
    });
  });

  it('shows an error toast when saving fails', async () => {
    authUserMock.mockReturnValue({ id: 'user-1' });
    saveSchemaSourceMock.mockResolvedValue({
      success: false,
      error: 'Database error',
    });

    const { user } = await renderEditorWithSource(VALID_JSON);

    await screen.findByText('Valid');

    await user.click(screen.getByRole('button', { name: messages.SwaggerEditor.actions.save }));

    expect(saveSchemaSourceMock).toHaveBeenCalledWith(VALID_JSON);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Database error');
    });
  });

  it('shows a generic error toast when saving throws', async () => {
    authUserMock.mockReturnValue({ id: 'user-1' });
    saveSchemaSourceMock.mockRejectedValue(new Error('Network error'));

    const { user } = await renderEditorWithSource(VALID_JSON);

    await screen.findByText('Valid');

    await user.click(screen.getByRole('button', { name: messages.SwaggerEditor.actions.save }));

    expect(saveSchemaSourceMock).toHaveBeenCalledWith(VALID_JSON);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(messages.SwaggerEditor.notifications.saveError);
    });
  });
});
