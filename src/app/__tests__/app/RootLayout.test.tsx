import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RootLayout from '@/app/layout';

describe('RootLayout Component', () => {
  it('should render and return children unmodified', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Root Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Root Content')).toBeInTheDocument();
  });
});
