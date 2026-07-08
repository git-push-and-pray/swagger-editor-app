import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LocaleLayout from '@/app/[locale]/(auth)/layout';

describe('LocaleLayout Component', () => {
  it('should render children elements correctly', () => {
    render(
      <LocaleLayout>
        <span data-testid="child-element">Hello World</span>
      </LocaleLayout>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
