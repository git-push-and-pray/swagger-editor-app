import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';

vi.mock('./Icon', () => ({
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

describe('Select Components', () => {
  it('should render SelectTrigger with default and custom classes', () => {
    render(
      <Select open={true}>
        <SelectTrigger className="my-test-class">
          <SelectValue placeholder="Chose item" />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    expect(trigger).toHaveClass('my-test-class', 'bg-bg');

    const icon = trigger.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-text-secondary');
  });

  it('should render SelectContent and inner components with correct classes', () => {
    render(
      <Select open={true}>
        <SelectContent className="my-content-class">
          <SelectGroup>
            <SelectLabel className="my-label-class">Options Label</SelectLabel>
            <SelectItem value="test-val" className="my-item-class">
              Item Text
            </SelectItem>
            <SelectSeparator className="my-separator-class" />
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    const label = screen.getByText('Options Label');
    expect(label).toHaveAttribute('data-slot', 'select-label');
    expect(label).toHaveClass('my-label-class', 'text-text-secondary/80');

    const item = screen.getByRole('option', { name: 'Item Text' });
    expect(item).toHaveAttribute('data-slot', 'select-item');
    expect(item).toHaveClass('my-item-class', 'focus:bg-secondary');

    const separator = item.parentElement?.querySelector('[data-slot="select-separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('my-separator-class', 'bg-border');
  });
});

describe('Select Components - Scroll Buttons (Direct VDOM Test)', () => {
  it('should build SelectScrollUpButton structure with correct classes and icon', () => {
    const vdom = SelectScrollUpButton({ className: 'my-up-btn' });

    expect(vdom.props['data-slot']).toBe('select-scroll-up-button');
    expect(vdom.props.className).toContain('my-up-btn');
    expect(vdom.props.className).toContain('bg-surface');

    const icon = vdom.props.children;
    expect(icon.props.name).toBe('chevron-down');
    expect(icon.props.className).toContain('rotate-180');
  });

  it('should build SelectScrollDownButton structure with correct classes and icon', () => {
    const vdom = SelectScrollDownButton({ className: 'my-down-btn' });

    expect(vdom.props['data-slot']).toBe('select-scroll-down-button');
    expect(vdom.props.className).toContain('my-down-btn');
    expect(vdom.props.className).toContain('bg-surface');

    const icon = vdom.props.children;
    expect(icon.props.name).toBe('chevron-down');
    expect(icon.props.className).not.toContain('rotate-180');
  });
});
