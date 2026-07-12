import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/Sheet';

describe('Sheet Component', () => {
  it('should render SheetTrigger with correct classes', () => {
    render(
      <Sheet>
        <SheetTrigger className="custom-trigger">Open</SheetTrigger>
      </Sheet>
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'sheet-trigger');
    expect(trigger).toHaveClass('cursor-pointer', 'custom-trigger');
  });

  it('should render SheetContent and layout elements when open', () => {
    render(
      <Sheet open={true}>
        <SheetContent className="custom-content">
          <div>Sheet Body Content</div>
        </SheetContent>
      </Sheet>
    );

    const content = screen.getByRole('dialog');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('data-slot', 'sheet-content');
    expect(content).toHaveAttribute('data-side', 'right');
    expect(content).toHaveClass('custom-content', 'bg-surface');

    expect(screen.getByText('Sheet Body Content')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn).toHaveAttribute('data-slot', 'sheet-close');
  });
});

describe('Sheet Component - Isolated Blocks (Direct VDOM Test)', () => {
  it('should build SheetClose structure with correct attributes', () => {
    const vdom = SheetClose({ className: 'custom-close', children: <span /> });

    expect(vdom.props['data-slot']).toBe('sheet-close');
    expect(vdom.props.className).toBe('custom-close');
  });

  it('should hide close button in SheetContent if showCloseButton is false', () => {
    render(
      <Sheet open={true}>
        <SheetContent showCloseButton={false}>
          <div>No Close Button Here</div>
        </SheetContent>
      </Sheet>
    );

    const closeBtn = screen.queryByRole('button', { name: 'Close' });
    expect(closeBtn).not.toBeInTheDocument();
  });
});
