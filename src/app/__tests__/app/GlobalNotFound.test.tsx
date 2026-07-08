import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import GlobalNotFound from '@/app/not-found';

interface MockNextErrorProps {
  statusCode: number;
}

vi.mock('next/error', () => ({
  default: ({ statusCode }: MockNextErrorProps) => (
    <div data-testid="next-error">Error Status: {statusCode}</div>
  ),
}));

describe('GlobalNotFound Component', () => {
  it('should render html structure with Next.js Error component set to 404', () => {
    render(<GlobalNotFound />);

    const errorComponent = screen.getByTestId('next-error');
    expect(errorComponent).toBeInTheDocument();
    expect(errorComponent).toHaveTextContent('Error Status: 404');
  });
});
