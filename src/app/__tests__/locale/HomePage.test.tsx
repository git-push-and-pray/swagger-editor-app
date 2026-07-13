import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HomePage from '@/app/[locale]/page';
import { getSavedSchemaSource } from '@/features/editor/services/getSavedSchemaSource';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `translated-${key}`),
}));

vi.mock('@/features/editor/services/getSavedSchemaSource', () => ({
  getSavedSchemaSource: vi.fn(),
}));

interface MockWorkspaceProps {
  initialSource: string;
}

vi.mock('@/features/workspace/ui/SwaggerWorkspace', () => ({
  SwaggerWorkspace: ({ initialSource }: MockWorkspaceProps) => (
    <div data-testid="swagger-workspace">Source: {initialSource}</div>
  ),
}));

describe('HomePage', () => {
  it('should fetch saved schema source and render SwaggerWorkspace', async () => {
    vi.mocked(getSavedSchemaSource).mockResolvedValueOnce('openapi: 3.0.0');

    const PageComponent = await HomePage();
    render(PageComponent);

    const hiddenHeading = screen.getByRole('heading', { level: 1, hidden: true });
    expect(hiddenHeading).toBeInTheDocument();
    expect(hiddenHeading).toHaveTextContent('translated-title');

    const workspace = screen.getByTestId('swagger-workspace');
    expect(workspace).toBeInTheDocument();
    expect(workspace).toHaveTextContent('Source: openapi: 3.0.0');
  });
});
