import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SwaggerWorkspace } from './SwaggerWorkspace';

vi.mock('@/features/editor/ui/SwaggerEditor', () => ({
  SwaggerEditor: () => <div>Swagger Editor</div>,
}));

describe('SwaggerWorkspace', () => {
  it('uses an orientation-based split layout', () => {
    const { container } = render(<SwaggerWorkspace />);

    const workspace = container.firstElementChild;

    expect(workspace).toHaveClass(
      'grid',
      'min-h-0',
      'flex-[1_1_0]',
      'grid-cols-1',
      'grid-rows-2',
      'landscape:grid-cols-2',
      'landscape:grid-rows-1'
    );
  });
});
